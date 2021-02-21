import { differenceInHours, formatISO } from 'date-fns'
import { Player, TourneyRanking } from '~/types/strapi'
import { client } from '../services/database'
import { logger } from '../services/logger'

export const getLatestTourneyRank = async (player: Player): Promise<TourneyRanking> => {
	const rankings = await client('rankings_tourney')
		// @ts-ignore
		.where('player', '=', player.id)
		.orderBy('date', 'desc')
		.limit(1)

	return rankings.length ? rankings[0] : null
}

export const createPlayerTourneyRank = async (rank: TourneyRanking): Promise<void> => {
	const latest = await getLatestTourneyRank(rank.player)
	if (latest) {
		const now = new Date()
		const old = new Date(latest.date)

		if (differenceInHours(now, old) < 3) {
			return logger.warn('Player rank already up to date')
		}
	}

	await client('rankings_tourney').insert({
		...rank,
		player: rank.player.id,
		created_by: 1,
		updated_by: 1,
		created_at: formatISO(new Date()),
		updated_at: formatISO(new Date()),
	})
	logger.debug('Rank saved')
}
