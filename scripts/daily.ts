import { goat } from 'kingsthrone-api'
import { logger } from './services/logger'
import {
	attendFeasts, contributeAlliance, doExpedition, doKingdomExpeditions, doMerchant,
	doProcessions, doWorldBoss, getDailyRewards, getLoginRewards, getThroneRoom, handleBag,
	getTourneyRewards, getWeeklyRewards, HallOfFame, hostCouncil, payHomage, punishPrisoners,
	handleSons, refreshTraining, visitInLaws, visitMaidens, readAndDeleteMail, getProgressionRewards
} from './actions'

export const dailyChores = async (): Promise<void> => {
	try {
		if (await getLoginRewards()) {
			await readAndDeleteMail()
			await punishPrisoners()
			await HallOfFame()
			await payHomage()
			await doKingdomExpeditions()
			await doMerchant(goat._isGautier() ? 150 : 80)
			await doExpedition(goat._isGautier() ? 100 : 50)
			await visitInLaws()
			await doProcessions(30)
			await visitMaidens(20)
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
	} catch (e) {
		logger.error(e)
		console.trace(e)
	}
}
