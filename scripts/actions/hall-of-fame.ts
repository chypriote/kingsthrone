import { goat } from '../services/requests'
import { logger } from '../services/logger'

export const payHomage = async (): Promise<void> => {
	try {
		await Promise.all([
			goat.payHomageKP(),
			goat.payHomageCampaign(),
			goat.payHomageIntimacy(),
		])
		logger.success('Homage in rankings paid')
	} catch (e) {
		logger.error(`[RANKINGS] ${e}`)
	}
}

export const HallOfFame = async (): Promise<void> => {
	try {
		await goat.payHomage()
		await goat.claimHomage()
		logger.success('Hall of fame done')
	} catch (e) {
		logger.error(`[HOF] ${e}`)
	}
}
