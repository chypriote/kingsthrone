import { differenceInHours, formatISO, isSameDay } from 'date-fns'
import { Player, KingdomRanking } from '~/types/strapi'
import { client } from '../services/database'
import { logger } from '../services/logger'

export const getLatestKingdomRank = async (player: Player): Promise<KingdomRanking|null> => {
	const rankings: KingdomRanking[] = await client('rankings_kingdom')
		// @ts-ignore
		.where('player', '=', player.id)
		.orderBy('date', 'desc')
		.limit(1)

	return rankings.length ? rankings[0] : null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const deleteKingdomRanking = async (rank: any): Promise<void> => {
	await client('rankings_kingdom').delete().where({ id: rank.id }).limit(1)
}

export const cleanUpKingdom = async (player: Player): Promise<number> => {
	const rankings: KingdomRanking[] = await client('rankings_kingdom')
		// @ts-ignore
		.where('player', '=', player.id)
		.orderBy('date', 'desc')

	const promises: Promise<void>[] = []
	rankings
		.map(rank => ({ ...rank, date: new Date(rank.date) }))
		.forEach((rank, index, array) => {
			if (!index) { return }
			if (isSameDay(rank.date, array[index - 1].date)) {
				promises.push(deleteKingdomRanking(rank))
			}
		})
	await Promise.all(promises)
	return promises.length
}


export const createPlayerKingdomRank = async (rank: KingdomRanking): Promise<void> => {
	const latest = await getLatestKingdomRank(rank.player)
	if (latest) {
		const now = new Date()
		const old = new Date(latest.date)

		if (differenceInHours(now, old) < 3) {
			return logger.warn('Player kingdom rank already up to date')
		}
	}

	await client('rankings_kingdom').insert({
		...rank,
		player: rank.player.id,
		created_by: 1,
		updated_by: 1,
		created_at: formatISO(new Date()),
		updated_at: formatISO(new Date()),
	})
	logger.debug('Rank saved')
}
