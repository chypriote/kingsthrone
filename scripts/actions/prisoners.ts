import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'

export const punishPrisoners = async (): Promise<void> => {
	try {
		let punishments = 10
		while (punishments >= 10) {
			const result = await goat.profile.punishPrisoner()
			punishments = result.mingwang.mw
		}
		logger.success('Prisoners punished')
	} catch (e) {
		logger.error(`[PRISONERS] ${e}`)
	}
}
