import { format } from 'date-fns'
import { DECREE_TYPE } from '../types/goat/Generic'
import { goat, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'
import { Hero } from './repository/roster'
import { doProcessions } from './actions/processions'
import { visitMaidens } from './actions/visit-maidens'
import { doExpedition, doMerchant } from './actions/expeditions'
import { attendFeasts } from './actions/feasts'
import { doKingdomExpeditions } from './actions/kexpeditions'
import { doWorldBoss } from './actions/worldboss'

const punishPrisoners = async () => {
	try {
		let punishments = 10
		while (punishments >= 10) {
			const result = await goat.punishPrisoner()
			punishments = result.mingwang.mw
		}
		logger.success('Prisoners punished')
	} catch (e) {
		logger.error(`[PRISONERS] ${e}`)
	}
}
const readAndDeleteMail = async () => {
	try {
		await goat.readAllMail()
		await goat.deleteAllMail()
		logger.success('Mail handled')
	} catch (e) {
		logger.error(`[MAIL] ${e}`)
	}
}
const raiseSons = async () => {
	try {
		if (await goat.raiseAllSons())
			logger.success('Children raised')
	} catch (e) {
		logger.error(`[CHILDREN] ${e}`)
	}
}
const refreshTraining = async () => {
	try {
		if (await goat.finishTraining()) {
			await goat.startTraining()
			logger.success('Training refreshed')
		}
	} catch (e) {
		logger.error(`[TRAINING] ${e}`)
	}
}
const HallOfFame = async () => {
	try {
		await goat.payHomage()
		await goat.claimHomage()
		logger.success('Hall of fame done')
	} catch (e) {
		logger.error(`[HOF] ${e}`)
	}
}
const contributeAlliance = async () => {
	try {
		await goat.contributeAlliance()
		const bosses = (await goat.getAllianceBossInfo()).filter(boss => boss.hp > 0)
		if (!bosses.length) return

		for (const hero of state.heroes) {
			await goat.fightAllianceBoss(bosses[0].id, hero.id)
		}
		logger.success('Alliance contributed')
	} catch (e) {
		logger.error(`[ALLIANCE] ${e}`)
	}
}
const payHomage = async () => {
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
const getDailyRewards = async () => {
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
const getWeeklyRewards = async () => {
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
const getTourneyRewards = async () => {
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
const getLoginRewards = async () => {
	try {
		await goat.claimLoginReward()
		logger.success('Got login reward')
		return true
	} catch (e) {
		logger.error(e)
		return false
	}
}
const getThroneRoom = async () => {
	try {
		await goat.getAllLevies()
		await goat.getAllDecreesResources(DECREE_TYPE.RESOURCES)
		logger.success('Emptied throne room')
	} catch (e) {
		logger.error(e)
	}
}
const visitInLaws = async () => {
	try {
		await goat.visitInLaws()
		logger.success('Visited in laws')
	} catch (e) {
		logger.error(e)
	}
}

interface AccountState {
	heroes: Hero[]
}
const state: AccountState = {
	heroes: [],
}

const dailyChores = async (account: string): Promise<void> => {
	await goat.login(account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)
	const info = await goat.getGameInfos()
	state.heroes = info.hero.heroList

	try {
		if (await getLoginRewards()) {
			await readAndDeleteMail()
			await punishPrisoners()
			await HallOfFame()
			await payHomage()
			await doProcessions(30)
			await visitMaidens(20)
			await contributeAlliance()
			await doMerchant(account === 'gautier' ? 50 : 40)
			await doExpedition(account === 'gautier' ? 50 : 40)
			await doKingdomExpeditions()
			await visitInLaws()
		}
		await getThroneRoom()
		await refreshTraining()
		await raiseSons()
		await doProcessions()
		await visitMaidens()
		await attendFeasts()
		await doWorldBoss()
		await getTourneyRewards()
		await getDailyRewards()
		await getWeeklyRewards()
	} catch (e) {
		logger.error(e)
	}
	logger.debug(format(new Date(), 'HH:mm'))
}

dailyChores(process.argv[2]).then(() => {process.exit()})
