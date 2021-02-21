import { logger } from './services/logger'
import { client } from './services/requests'
import { updateTourneyLadder } from './tourney'
import { updateKingdomLadder } from './kingdom'
import { updateAlliances } from './alliance'
import { updateProfiles } from './profiles'

const update = async () => {
	await client.login()
	await Promise.all([
		updateTourneyLadder(),
		updateKingdomLadder(),
		updateAlliances(),
	])
	await updateProfiles()
}

update()
	.then(() => logger.success('updated'))
	.catch(e => logger.error(e.toString()))
	.finally(() => process.exit())
