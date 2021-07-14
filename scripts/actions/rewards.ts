import { goat } from '../services/requests'
import { logger } from '../services/logger'

export const getDailyRewards = async (): Promise<void> => {
	try {
		let result = false
		await goat.claimDailyPoints()
		result = await goat.getDailyReward(1) ? true : result
		result = await goat.getDailyReward(2) ? true : result
		result = await goat.getDailyReward(3) ? true : result
		result = await goat.getDailyReward(4) ? true : result
		result = await goat.getDailyReward(5) ? true : result
		if (result) {
			logger.success('Daily rewards claimed')
		}
	} catch (e) {
		logger.log(e)
		logger.error(`[REWARDS] ${e}`)
	}
}
export const getWeeklyRewards = async (): Promise<void> => {
	try {
		let result = false
		await goat.claimWeeklyPoints()
		result = await goat.getWeeklyReward(1) ? true : result
		result = await goat.getWeeklyReward(2) ? true : result
		result = await goat.getWeeklyReward(3) ? true : result
		result = await goat.getWeeklyReward(4) ? true : result
		result = await goat.getWeeklyReward(5) ? true : result
		if (result) {
			logger.success('Weekly rewards claimed')
		}
	} catch (e) {
		logger.log(e)
		logger.error(`[REWARDS] ${e}`)
	}
}
export const getTourneyRewards = async (): Promise<void> => {
	try {
		let result = false
		result = await goat.getTourneyReward(1) ? true : result
		result = await goat.getTourneyReward(2) ? true : result
		result = await goat.getTourneyReward(3) ? true : result
		result = await goat.getTourneyReward(4) ? true : result
		if (result) {
			logger.success('Tourney rewards claimed')
		}
	} catch (e) {
		logger.log(e)
		logger.error(`[REWARDS] ${e}`)
	}
}
export const getLoginRewards = async (): Promise<boolean> => {
	try {
		await goat.claimLoginReward()
		logger.success('Got login reward')
		return true
	} catch (e) {
		return false
	}
}
export const getProgressionRewards = async (): Promise<void> => {
	try {
		await goat.getProgressionReward()
		logger.success('Progression rewards claimed')
	} catch (e) {/* do nothing */}
}
