import { config } from 'dotenv'
config()
import chalk from 'chalk'
import { logger } from './services/logger'
import { createAlliance, getAllianceByAID, updateAlliance } from './repository/alliance'
import { Goat } from './services/goat'

export const updateAlliances = async(): Promise<void> => {
	const goat = new Goat()
	const clubs = await goat.alliance.getLadder()

	for (const club of clubs) {
		logger.log(`Handling ${chalk.bold(club.name)}`)
		const aid = club.id
		const alliance = await getAllianceByAID(aid)

		if (!alliance) {
			logger.debug(`Alliance ${aid} (${club.name}) not found`)
			await createAlliance(
				aid,
				club.name,
				club.allShiLi,
				club.fund,
				club.level,
				club.outmsg
			)
		} else {
			await updateAlliance(
				aid,
				club.name,
				club.allShiLi,
				club.fund,
				club.level,
				club.outmsg
			)
		}
	}

	logger.success('Finished')
}
