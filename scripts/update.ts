import { logger } from './services/logger'
import { updateProfiles } from './update/profiles'
import { updateAlliances } from './update/alliances'

const updateAll = async (): Promise<void> => {
	await updateAlliances()
	await updateProfiles()
}

updateAll()
	.then(() => logger.success('updated'))
	.catch(e => logger.error(e.toString()))
