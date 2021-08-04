import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'

export const punishPrisoners = async (): Promise<void> => {
	try {
		let punishments = 10
		let i = 1
		while (punishments >= 10) {
			if (i === 10 && punishments < 100) { break }
			const result = await goat.profile.punishPrisoner()
			punishments = result.mingwang.mw
			i++
		}
		logger.success('Prisoners punished')
	} catch (e) {
		logger.error(`[PRISONERS] ${e}`)
	}
}
