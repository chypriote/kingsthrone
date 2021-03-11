import { differenceInHours, formatISO } from 'date-fns'
import { KingdomRank, Profile, TourneyRank } from '~/types/goat'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { Player } from '~/types/Player'

export const createPlayer = async (
	gid: number, name: string, vip = 0, power = 0, heroes = 0, server = 699
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
	logger.debug(`Player ${name} created`)
}

export const getPlayers = async (): Promise<Player[]> => {
	return client('players')
}

export const getPlayerByGID = async (gid: number): Promise<Player> => {
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

export const updatePlayerDetails = async (player: Player, details: Profile): Promise<void> => {
	await client('players')
		.update({
			name: details.name,
			vip: details.vip,
			level: details.level,
			power: details.shili,
			military: details.ep.e1,
			fortune: details.ep.e2,
			provisions: details.ep.e3,
			inspiration: details.ep.e4,
			intimacy: details.love,
			heroes: details.hero_num,
			maidens: details.wife_num,
			children: details.son_num,
			ratio: Math.round(parseInt(details.shili) / details.hero_num),
			updated_at: formatISO(new Date()),
		})
		.where('gid', '=', player.gid)
		.limit(1)
}

export const getOrCreatePlayerFromGoat = async (rank: TourneyRank|KingdomRank): Promise<Player> => {
	const uid = parseInt(rank.uid)
	let player = await getPlayerByGID(uid)

	if (!player) {
		await createPlayer(uid, rank.name, rank.vip)
		player = await getPlayerByGID(uid)
	} else if (player.name !== rank.name || player.vip !== rank.vip) {
		await updatePlayer(player, rank.name, rank.vip)
	}

	return player
}

export const getAllGID = async (): Promise<{gid: string}[]> => {
	return client('players').select('gid')
}

export const checkInactivity = async (player: Player, profile: Profile): Promise<void> => {
	let inactivity

	if (differenceInHours(new Date(), new Date(player.updated_at)) < 3) { return }

	if (player.power.toString() !== profile.shili.toString()) {
		inactivity = false
	}
	if (player.power.toString() === profile.shili.toString() && player.inactive === false) {
		inactivity = null
		logger.warn('Marked to check inactivity')
	}
	if (player.power.toString() === profile.shili.toString() && player.inactive === null) {
		inactivity = true
		logger.error('Marked inactive')
	}

	await client('players')
		.update({ inactive: inactivity })
		.where({ id: player.id })
}
