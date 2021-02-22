import { formatISO } from 'date-fns'
import { KingdomRank, Profile, TourneyRank } from '~/types/goat'
import { Player } from '~/types/strapi'
import { client } from '../services/database'
import { logger } from '../services/logger'

export const createPlayer = async (gid: number, name: string, vip = 0): Promise<void> => {
	await client('players').insert({
		gid, name, vip,
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
