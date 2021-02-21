import { config } from 'dotenv'
config()
import chalk from 'chalk'
import formatISO from 'date-fns/formatISO'
import { logger } from './services/logger'
import { client } from './services/requests'
import { getOrCreatePlayerFromGoat } from './repository/player'
import { createPlayerKingdomRank } from './repository/kingdom-rankings'

export const updateKingdomLadder = async (): Promise<void> => {
	const now = Date.now()
	const rankings = await client.getKingdomRankings()

	for (const rank of rankings) {
		logger.log(`Handling ${chalk.bold(rank.name)}`)
		const player = await getOrCreatePlayerFromGoat(rank)

		await createPlayerKingdomRank({
			player,
			date: formatISO(now),
			power: rank.num,
			level: rank.level,
			rank: rank.rid,
		})
	}

	logger.success('Finished')
}

updateKingdomLadder().then(() => process.exit())
