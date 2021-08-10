import { goat } from 'kingsthrone-api'
import { logger } from './services/logger'
import {
	attendFeasts, contributeAlliance, doExpedition, doMerchant,
	doProcessions, doWorldBoss, getDailyRewards, getLoginRewards, getThroneRoom, handleBag,
	getTourneyRewards, getWeeklyRewards, HallOfFame, hostCouncil, payHomage, punishPrisoners,
	handleSons, refreshTraining, visitInLaws, visitMaidens, readAndDeleteMail, getProgressionRewards, doKingdomExpeditions
} from './actions'

export const dailyChores = async (): Promise<void> => {
	try {
		if (await getLoginRewards()) {
			await readAndDeleteMail()
			await punishPrisoners()
			await HallOfFame()
			await payHomage()
			await doKingdomExpeditions()
			if (goat._isShallan()) {
				await doMerchant(10)
				await doExpedition(10)
			} else {
				await doMerchant(goat._isGautier() ? 100 : 70)
				await doExpedition(goat._isGautier() ? 100 : 60)
			}
			await visitInLaws()
			if (goat._isGautier() || goat._isDemophlos()) {
				await doProcessions(30)
				await visitMaidens(20)
			}
		}
		await getThroneRoom()
		await refreshTraining()
		await handleSons()
		await doProcessions()
		await visitMaidens()
		await attendFeasts()
		await hostCouncil()
		await doWorldBoss()
		await contributeAlliance()
		await getTourneyRewards()
		await getDailyRewards()
		await getWeeklyRewards()
		await getProgressionRewards()
		await handleBag()
		try {
			await goat.events.castle.findEgg()
			await goat.events.castle.claimEgg()
		} catch (e) {/* do nothing */}
	} catch (e) {
		logger.error(e)
		console.trace(e)
	}
}
