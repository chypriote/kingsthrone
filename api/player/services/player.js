'use strict'

const chalk = require('chalk')
const formatISO = require('date-fns/formatISO')
const differenceInHours = require('date-fns/differenceInHours')

module.exports = {
	getPlayersRatio: async (limit = 0, order = 'asc', heroes = 0) => {
		const knex = strapi.connections.default
		let query = `select *, div(players.power, players.heroes) as ratio from players ${heroes ? `where players.heroes > ${heroes} ` : ''}order by ratio ${order} limit ${limit ? limit : 100}`

		const result = await knex.raw(query)
		return result.rows
	},
	createPlayer: async (gid, name, vip = 0, power = 0, heroes = 0) => {
		const knex = strapi.connections.default
		const logger = strapi.services.logger

		await knex('players').insert({
			gid, name, vip, power, heroes,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
		logger.debug(`Player ${name} created`)
	},
	updatePlayer: async (gid, name, vip = 0, power = 0, heroes = 0) => {
		const knex = strapi.connections.default
		const logger = strapi.services.logger

		await knex('players').update({
			gid, name, vip, power, heroes,
			updated_at: formatISO(new Date()),
		}).where({ gid })
		logger.debug(`Player ${name} updated`)
	},
	getOrCreatePlayerFromGoat: async (goat) => {
		const _this = strapi.services.player
		const gid = parseInt(goat.uid)
		let player = await strapi.query('player').findOne({ gid })

		if (!player) {
			await _this.createPlayer(gid, goat.name, goat.vip)
			player = await strapi.query('player').findOne({ gid })
		} else if (player.name !== goat.name || player.vip !== goat.vip) {
			await _this.updatePlayer(gid, goat.name, goat.vip)
		}

		return player
	},
	updateProfile: async (profile) => {
		const { goat, logger, player } = strapi.services
		logger.log(`Handling ${chalk.bold(profile.name)}`)

		if (differenceInHours(new Date(), new Date(profile.updated_at)) < 3) { return logger.warn('Player profile already up to date') }

		try {
			const item = await goat.getProfile(profile.gid)
			if (!item) {return}

			await Promise.all([
				player.updatePlayerDetails(profile, item),
				player.updatePlayerAlliance(profile, item),
			])
			await player.checkInactivity(profile)
		} catch (e) {
			logger.error(`Error updating ${player.gid} (${player.name}): ${e.toString()}`)
		}
	},
	updatePlayerDetails: async (player, goat) => {
		await strapi.connections.default('players')
			.update({
				name: goat.name,
				vip: goat.vip,
				level: goat.level,
				power: goat.shili,
				battle: goat.smap,
				previous: player.power,
				military: goat.ep.e1,
				fortune: goat.ep.e2,
				provisions: goat.ep.e3,
				inspiration: goat.ep.e4,
				intimacy: goat.love,
				heroes: goat.hero_num,
				maidens: goat.wife_num,
				children: goat.son_num,
				updated_at: formatISO(new Date()),
			})
			.where('gid', '=', player.gid)
			.limit(1)
	},
	joinAlliance: async (player, goat) => {
		const { alliance, logger } = strapi.services
		const knex = strapi.connections.default

		let ally = await alliance.getOrCreateAllianceFromGoat(goat)

		await knex('alliance_members')
			.insert({
				alliance: ally.id,
				player: player.id,
				active: true,
				created_by: 1,
				updated_by: 1,
				created_at: formatISO(new Date()),
				updated_at: formatISO(new Date()),
			})
		logger.success(`${player.name} joined alliance ${ally.name}`)
	},
	leaveAlliance: async (player, current) => {
		const { logger } = strapi.services
		const knex = strapi.connections.default
		await knex('alliance_members')
			.update({ active: 0, leftAt: formatISO(new Date()), updated_at: formatISO(new Date()) })
			.where({ player: player.id })
		logger.error(`${player.name} left alliance ${current.name}`)
	},
	updatePlayerAlliance: async (player, goat) => {
		const _this = strapi.services.player
		//Check if player currently has alliance
		const current = await strapi.query('alliance').findOne({ 'alliance_members.player': player.id, 'alliance_members.active': true })

		//Return if no current and club is 0
		if (!current && goat.clubid === 0) {
			return
		}
		//Add Alliance if no previous
		if (!current) {
			return await _this.joinAlliance(player, goat)
		}
		//Return if current ally is same
		if (parseInt(String(current.aid)) === goat.clubid) {
			return
		}
		//Leave if new alliance is 0
		if (goat.clubid === 0) {
			return await _this.leaveAlliance(player, current)
		}
		//Leave and join new if clubid changed
		await _this.leaveAlliance(player, current)
		await _this.joinAlliance(player, goat)
	},
	checkInactivity: async (player) => {
		const { logger } = strapi.services
		const knex = strapi.connections.default
		let inactivity

		if (player.power !== player.previous) {
			inactivity = false
		}
		if (player.power === player.previous && player.inactive === false) {
			inactivity = null
			logger.warn('Marked to check inactivity')
		}
		if (player.power === player.previous && player.inactive === null) {
			inactivity = true
			logger.error('Marked inactive')
		}

		await knex('players')
			.update({ inactive: inactivity, updated_at: formatISO(new Date()) })
			.where({ id: player.id })
	},
}
