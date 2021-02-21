import { differenceInHours, formatISO } from 'date-fns'
import { Player, KingdomRanking } from '~/types/strapi'
import { client } from '~/scripts/services/database'
import { logger } from '~/scripts/services/logger'

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
