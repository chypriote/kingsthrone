import { formatISO } from 'date-fns'
import { Profile } from '~/types/goatGeneric'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { Player } from '~/types/strapi/Player'
import { goat } from '../services/requests'

export const createPlayer = async (
	gid: string, name: string, vip = 0, power = 0, heroes = 0, server = 699
): Promise<void> => {
	await client('players').insert({
		gid, name, vip, power, heroes,
		server,
		ratio: Math.round(power / heroes),
		created_by: 1,
		updated_by: 1,
		created_at: formatISO(new Date()),
		updated_at: formatISO(new Date()),
	})
	logger.success(`Player ${name} created`)
}

export const getPlayers = async (params = {}): Promise<Player[]> => {
	return client('players').where(params)
}

export const getPlayerByGID = async (gid: string): Promise<Player> => {
	const players = await client('players')
		.where('gid', '=', gid)
		.limit(1)

	return players.length ? players[0] : null
}

export const updatePlayer = async (player: Player, name: string, vip: number): Promise<void> => {
	await client('players')
		.where({ gid: player.gid })
		.update({ name, vip })
	logger.debug('Player updated')
}

export const updatePlayerDetails = async (player: Player, goat: Profile): Promise<void> => {
	await client('players')
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
			ratio: Math.round(parseInt(goat.shili) / goat.hero_num),
			updated_at: formatISO(new Date()),
		})
		.where('gid', '=', player.gid)
		.limit(1)
}

export const getOrCreatePlayerFromGoat = async (uid: string): Promise<Player> => {
	const player = await getPlayerByGID(uid)

	if (player) {
		return player
	}

	const profile = await goat.getProfile(uid)

	if (!profile) {
		throw new Error(`Player with id ${uid} not found`)
	}

	await createPlayer(uid, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, parseInt(profile.id.toString().substr(0, 3)))

	return await getPlayerByGID(uid)
}

export const getAllGID = async (params= {}): Promise<{gid: string}[]> => {
	return client('players').select('gid').where(params)
}

export const checkInactivity = async (player: Player): Promise<void> => {
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

	await client('players')
		.update({ inactive: inactivity, updated_at: formatISO(new Date()) })
		.where({ id: player.id })
}
