import { config } from 'dotenv'
config()
import chalk from 'chalk'
import formatISO from 'date-fns/formatISO'
import { logger } from './services/logger'
import { getTourneyRankings } from './services/requests'

import { createPlayerTourneyRank, getOrCreatePlayerFromGoat } from './repository/player'

async function updateTourney() {
	const now = Date.now()
	const rankings = await getTourneyRankings()

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

updateTourney().then(() => process.exit())
