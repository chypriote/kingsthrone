import { logger } from './services/logger'
import { client } from './services/requests'
import { updateTourneyLadder } from './tourney'
import { updateKingdomLadder } from './kingdom'
import { updateAlliances } from './alliance'
import { updateProfiles } from './profiles'

const updateAll = async (): Promise<void> => {
	await client.login()

	await Promise.all([
		updateTourneyLadder(),
		updateKingdomLadder(),
		updateAlliances(),
	])
	await updateProfiles()
}

updateAll()
	.then(() => logger.success('updated'))
	.catch(e => logger.error(e.toString()))
