import { goat } from 'kingsthrone-api'
import { find } from 'lodash'
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
		const titles = await goat.hallOfFame.getHoFInfo()
		
		const mine = find(titles, t => t.uid === goat._getGid())

		if (!mine) {
			await goat.hallOfFame.payHomage(titles[0].uid, titles[0].id)
			logger.success('HoF homage paid')
			return
		}

		await goat.hallOfFame.payHomage(mine.uid, mine.id)
		await goat.hallOfFame.claimHomage()
		logger.success('HoF homage paid and claimed')
	} catch (e) {
		logger.error(`[HOF] ${e}`)
	}
}
