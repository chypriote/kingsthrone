import { goat } from '../services/goat'
import { logger } from '../services/logger'

export const payHomage = async (): Promise<void> => {
	try {
		await Promise.all([
			goat.rankings.payHomageKP(),
			goat.rankings.payHomageCampaign(),
			goat.rankings.payHomageIntimacy(),
		])
		logger.success('Homage in rankings paid')
	} catch (e) {
		logger.error(`[RANKINGS] ${e}`)
	}
}

export const HallOfFame = async (): Promise<void> => {
	try {
		await goat.hallOfFame.payHomage()
		await goat.hallOfFame.claimHomage()
		logger.success('Hall of fame done')
	} catch (e) {
		logger.error(`[HOF] ${e}`)
	}
}
