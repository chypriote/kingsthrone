import { goat } from '../services/goat'
import { logger } from '../services/logger'

export const getDailyRewards = async (): Promise<void> => {
	try {
		let result = false
		await goat.rewards.claimDailyPoints()
		result = await goat.rewards.getDailyReward(1) ? true : result
		result = await goat.rewards.getDailyReward(2) ? true : result
		result = await goat.rewards.getDailyReward(3) ? true : result
		result = await goat.rewards.getDailyReward(4) ? true : result
		result = await goat.rewards.getDailyReward(5) ? true : result
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
		await goat.rewards.claimWeeklyPoints()
		result = await goat.rewards.getWeeklyReward(1) ? true : result
		result = await goat.rewards.getWeeklyReward(2) ? true : result
		result = await goat.rewards.getWeeklyReward(3) ? true : result
		result = await goat.rewards.getWeeklyReward(4) ? true : result
		result = await goat.rewards.getWeeklyReward(5) ? true : result
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
		result = await goat.tourney.getTourneyReward(1) ? true : result
		result = await goat.tourney.getTourneyReward(2) ? true : result
		result = await goat.tourney.getTourneyReward(3) ? true : result
		result = await goat.tourney.getTourneyReward(4) ? true : result
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
		await goat.rewards.claimLoginReward()
		logger.success('Got login reward')
		return true
	} catch (e) {
		return false
	}
}
export const getProgressionRewards = async (): Promise<void> => {
	try {
		if (await goat.rewards.getProgressionReward())
			logger.success('Progression rewards claimed')
	} catch (e) {/* do nothing */}
}
