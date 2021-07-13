import { format } from 'date-fns'
import { goat } from './services/requests'
import { logger } from './services/logger'
import {
	attendFeasts, contributeAlliance, doExpedition, doKingdomExpeditions, doMerchant,
	doProcessions, doWorldBoss, getDailyRewards, getLoginRewards, getThroneRoom,
	getTourneyRewards, getWeeklyRewards, HallOfFame, hostCouncil, payHomage, punishPrisoners,
	raiseSons, refreshTraining, visitInLaws, visitMaidens, readAndDeleteMail
} from './actions'

export const dailyChores = async (): Promise<void> => {
	try {
		if (await getLoginRewards()) {
			await readAndDeleteMail()
			await punishPrisoners()
			await HallOfFame()
			await payHomage()
			await doProcessions(30)
			await visitMaidens(20)
			await doMerchant(goat.gid === '699002934' ? 100 : 40)
			await doExpedition(goat.gid === '699002934' ? 100 : 40)
			await doKingdomExpeditions()
			await visitInLaws()
		}
		await getThroneRoom()
		await refreshTraining()
		await raiseSons()
		await doProcessions()
		await visitMaidens()
		await attendFeasts()
		await hostCouncil()
		await doWorldBoss()
		await contributeAlliance()
		await getTourneyRewards()
		await getDailyRewards()
		await getWeeklyRewards()
	} catch (e) {
		logger.error(e)
	}
	logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
}
