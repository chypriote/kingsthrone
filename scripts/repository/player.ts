import { differenceInHours, formatISO } from 'date-fns'
import { Profile } from '~/types/goat'
import { Player, Ranking } from '~/types/types'
import { client } from '../services/database'
import { logger } from '../services/logger'

export const createPlayer = async (gid: number, name: string, vip: number): Promise<void> => {
	await client('players').insert({
		gid, name, vip,
		created_by: 1,
		updated_by: 1,
		created_at: formatISO(new Date()),
		updated_at: formatISO(new Date()),
	})
	logger.debug('Player created')
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

export const getLatestRank = async (player: Player): Promise<Ranking> => {
	const rankings = await client('rankings')
		.where('player', '=', player.gid)
		.orderBy('date', 'desc')
		.limit(1)

	return rankings.length ? rankings[0] : null
}

export const createPlayerRank = async (rank: Ranking): Promise<void> => {
	const latest = await getLatestRank(rank.player)
	if (latest) {
		const now = new Date()
		const old = new Date(latest.date)

		if (differenceInHours(now, old) < 3) {
			return logger.warn('Player rank already up to date')
		}
	}

	await client('rankings').insert({
		...rank,
		created_by: 1,
		updated_by: 1,
		created_at: formatISO(new Date()),
		updated_at: formatISO(new Date()),
	})
	logger.debug('Rank saved')
}

export const updatePlayerDetails = async (player: Player, details: Profile): Promise<void> => {
	await client('players')
		.update({
			name: details.name,
			vip: details.vip,
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
	logger.debug(`Player ${player.name} details updated`)
}
