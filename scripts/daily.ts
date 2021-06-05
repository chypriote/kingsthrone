import { DECREE_TYPE } from '../types/goat/Generic'
import { goat, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'
import { Hero } from './repository/roster'
import { doProcessions } from './actions/processions'
import { visitMaidens } from './actions/visit-maidens'
import { doExpeditions } from './actions/expeditions'

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
const attendFeasts = async () => {
	try {
		const feasts = (await goat.getFeastsInfo()).lbList
		for (let i = 0; i < 3; i++) {
			await goat.joinFeast(feasts[i].uid)
		}
		logger.success('Feasts attended')
	} catch (e) {
		logger.error(`[FEASTS] ${e}`)
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
		await goat.getDailyReward(1)
		await goat.getDailyReward(2)
		await goat.getDailyReward(3)
		await goat.getDailyReward(4)
		await goat.getDailyReward(5)
		logger.success('Daily rewards claimed')
	} catch (e) {
		logger.log(e)
		logger.error(`[REWARDS] ${e}`)
	}
}
const getLoginRewards = async () => {
	try {
		await goat.claimLoginReward()
		logger.success('Got login reward')
	} catch (e) {
		logger.error(e)
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

const chores = async (account: string): Promise<void> => {
	await goat.login(account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)
	try {
		await getThroneRoom()
		await doProcessions()
		await visitMaidens()
		await refreshTraining()
		await raiseSons()
		logger.success('Chores done')
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
		await getLoginRewards()
		await getThroneRoom()
		await readAndDeleteMail()
		await punishPrisoners()
		await HallOfFame()
		await attendFeasts()
		await payHomage()
		await doProcessions(30)
		await visitMaidens(20)
		await contributeAlliance()
		await doExpeditions(account === 'gautier' ? 50 : 40)
		await getDailyRewards()
	} catch (e) {
		logger.error(e)
	}
}

//dailyChores(process.argv[2]).then(() => {process.exit()})
chores(process.argv[2]).then(() => {process.exit()})
