'use strict'
const formatISO = require('date-fns/formatISO')

module.exports = {
	createAlliance: async (club) => {
		const aid = parseInt(club.id)
		const knex = strapi.connections.default
		const logger = strapi.services.logger

		await knex('alliances').insert({
			aid,
			name: club.name,
			power: club.allShiLi,
			reputation: parseInt(club.fund),
			level: parseInt(club.level),
			motto: club.outmsg,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
		logger.debug(`Alliance ${club.name} created`)
	},
	updateAlliance: async (alliance, club) => {
		const aid = parseInt(club.id)
		const knex = strapi.connections.default
		const logger = strapi.services.logger

		await knex('alliances').update({
			aid,
			name: club.name,
			power: club.allShiLi,
			reputation: parseInt(club.fund),
			level: parseInt(club.level),
			motto: club.outmsg,
			updated_at: formatISO(new Date()),
		}).where({ aid })
		logger.debug(`Alliance ${club.name} updated`)
	},
	getOrCreateAllianceFromGoat: async (goat) => {
		const knex = strapi.connections.default
		const aid = parseInt(goat.clubid)
		let alliance = await strapi.query('alliance').findOne({ aid })

		if (!alliance) {
			await knex('alliances').insert({ aid, name: goat.clubname })
			alliance = await strapi.query('player').findOne({ aid })
		}

		return alliance
	},
}
