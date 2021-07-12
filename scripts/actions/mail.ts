import { goat } from '../services/requests'
import { logger } from '../services/logger'

export const readAndDeleteMail = async (): Promise<void> => {
	try {
		await goat.readAllMail()
		await goat.deleteAllMail()
		logger.success('Mail handled')
	} catch (e) {
		logger.error(`[MAIL] ${e}`)
	}
}
