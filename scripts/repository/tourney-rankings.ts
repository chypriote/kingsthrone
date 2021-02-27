import { differenceInHours, formatISO, isSameDay } from 'date-fns'
import { TourneyRanking, Player } from '~/types/strapi'
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const deleteTourneyRanking = async (rank: any): Promise<void> => {
	await client('rankings_tourney').delete().where({ id: rank.id }).limit(1)
}

export const cleanUpTourney = async (player: Player): Promise<number> => {
	const rankings: TourneyRanking[] = await client('rankings_tourney')
		// @ts-ignore
		.where('player', '=', player.id)
		.orderBy('date', 'desc')

	const promises: Promise<void>[] = []
	rankings
		.map(rank => ({ ...rank, date: new Date(rank.date) }))
		.forEach((rank, index, array) => {
			if (!index) { return }
			if (isSameDay(rank.date, array[index - 1].date)) {
				promises.push(deleteTourneyRanking(rank))
			}
		})
	await Promise.all(promises)
	return promises.length
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
