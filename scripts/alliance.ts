import { config } from 'dotenv'
import chalk from 'chalk'
import { logger } from './services/logger'
import { getAllianceLadder } from './services/requests'
import { createAlliance, getAllianceByAID, updateAlliance } from './repository/alliance'

config()

async function updateAlliances() {
	const clubs = await getAllianceLadder()
	for (const club of clubs) {
		logger.log(`Handling ${chalk.bold(club.name)}`)
		const aid = parseInt(club.id)
		const alliance = await getAllianceByAID(aid)

		if (!alliance) {
			logger.debug(`Alliance ${aid} (${club.name}) not found`)
			await createAlliance(
				aid,
				club.name,
				club.allShiLi,
				parseInt(club.fund),
				parseInt(club.level),
				club.outmsg
			)
		} else {
			await updateAlliance(
				aid,
				club.name,
				club.allShiLi,
				parseInt(club.fund),
				parseInt(club.level),
				club.outmsg
			)
		}
	}
}

updateAlliances().then(() => process.exit())
