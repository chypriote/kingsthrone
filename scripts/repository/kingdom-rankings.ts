import { differenceInHours, formatISO } from 'date-fns'
import { reduce } from 'lodash'
import { Player, KingdomRanking } from '~/types/strapi'
import { client } from '../services/database'
import { logger } from '../services/logger'

export const checkInactivity = async (player: Player): Promise<void> => {
	const rankings: KingdomRanking[] = await client('rankings_kingdom')
		// @ts-ignore
		.where('player', '=', player.id)
		.orderBy('date', 'desc')
		.limit(4)
	const sum = reduce(rankings, (sum: number, r: KingdomRanking) => sum + r.power, 0)

	await client('players')
		.update({ inactive: sum / 4 === rankings[0].power })
		.where({ id: player.id })
	logger.success(`Set ${sum / 4 === rankings[0].power ? 'inactive' : 'active'}`)
}

export const getLatestKingdomRank = async (player: Player): Promise<KingdomRanking> => {
	const rankings = await client('rankings_kingdom')
		// @ts-ignore
		.where('player', '=', player.id)
		.orderBy('date', 'desc')
		.limit(1)

	return rankings.length ? rankings[0] : null
}

export const createPlayerKingdomRank = async (rank: KingdomRanking): Promise<void> => {
	const latest = await getLatestKingdomRank(rank.player)
	if (latest) {
		const now = new Date()
		const old = new Date(latest.date)

		if (differenceInHours(now, old) < 3) {
			return logger.warn('Player rank already up to date')
		}
	}

	if (latest.power === rank.power) {
		logger.warn('Same power')
		await checkInactivity(rank.player)
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
