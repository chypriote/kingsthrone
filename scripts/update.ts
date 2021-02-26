import { logger } from './services/logger'
import { client } from './services/requests'
import { updateTourneyLadder } from './tourney'
import { updateKingdomLadder } from './kingdom'
import { updateProfiles } from './profiles'
import { updateAlliances } from './alliances'

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
