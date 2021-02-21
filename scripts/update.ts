import { updateTourneyLadder } from '~/scripts/tourney'
import { updateKingdomLadder } from '~/scripts/kingdom'
import { updateAlliances } from '~/scripts/alliance'
import { updateProfiles } from '~/scripts/profiles'
import { logger } from '~/scripts/services/logger'

const update = async () => {
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
