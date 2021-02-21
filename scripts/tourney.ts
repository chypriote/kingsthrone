import { config } from 'dotenv'
config()
import chalk from 'chalk'
import formatISO from 'date-fns/formatISO'
import { logger } from './services/logger'
import { client } from './services/requests'
import { getOrCreatePlayerFromGoat } from './repository/player'
import { createPlayerTourneyRank } from './repository/tourney-rankings'

export const updateTourneyLadder = async(): Promise<void> => {
	const now = Date.now()
	const rankings = await client.getTourneyRankings()

	for (const rank of rankings) {
		logger.log(`Handling ${chalk.bold(rank.name)}`)
		const player = await getOrCreatePlayerFromGoat(rank)

		await createPlayerTourneyRank({
			player,
			date: formatISO(now),
			rank: rank.rid,
			points: rank.num,
		})
	}

	logger.success('Finished')
}

updateTourneyLadder().then(() => process.exit())
