import { logger } from './services/logger'
import { updateProfiles } from './profiles'
import { updateAlliances } from './alliances'

const updateAll = async (): Promise<void> => {
	await updateAlliances()
	await updateProfiles()
}

updateAll()
	.then(() => logger.success('updated'))
	.catch(e => logger.error(e.toString()))
