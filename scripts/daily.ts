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
		logger.log(e)
		logger.error('Error while punishing prisoners')
	}
}

const readAndDeleteMail = async () => {
	try {
		await goat.readAllMail()
		await goat.deleteAllMail()
		logger.success('Mail handled')
	} catch (e) {
		logger.log(e)
		logger.error('Error while handling mail')
	}
}
const raiseSons = async () => {
	if (await goat.raiseAllSons())
		logger.success('Children raised')
}
const refreshTraining = async () => {
	try {
		if (await goat.finishTraining()) {
			await goat.startTraining()
			logger.success('Training refreshed')
		}
	} catch (e) {
		logger.error(`Error while doing training: ${e}`)
	}
}
const HallOfFame = async () => {
	try {
		await goat.payHomage()
		await goat.claimHomage()
		logger.success('Hall of fame done')
	} catch (e) {
		logger.log(e)
		logger.error('Error while doing hall of fame')
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
		logger.log(e)
		logger.error('Error while doing alliance contribution')
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
		logger.log(e)
		logger.error('Error while attending feasts')
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
		logger.log(e)
		logger.error('Error while paying homage in rankings')
	}
}

const getDailyRewards= async () => {
	try {
		await goat.getDailyReward(1)
		await goat.getDailyReward(2)
		await goat.getDailyReward(3)
		await goat.getDailyReward(4)
		await goat.getDailyReward(5)
		logger.success('Daily rewards claimed')
	} catch (e) {
		logger.log(e)
		logger.error('Error while getting daily rewards')
	}
}

const chores = async () => {
	await goat.login(LOGIN_ACCOUNT_GAUTIER)
	try {
		await goat.getAllLevies()
		await goat.getAllDecreesResources(DECREE_TYPE.RESOURCES)
		await doProcessions()
		await visitMaidens()
		await refreshTraining()
		await raiseSons()
		logger.success('Chores done')
	} catch (e) {
		logger.log(e)
		logger.error('Error while doing chores')
	}
}

interface AccountState {
	heroes: Hero[]
}
const state: AccountState = {
	heroes: [],
}

const dailyChores = async (): Promise<void> => {
	await goat.login(LOGIN_ACCOUNT_GAUTIER)
	const info = await goat.getGameInfos()
	state.heroes = info.hero.heroList

	try {
		await chores()
		await goat.claimLoginReward()
		await readAndDeleteMail()
		await punishPrisoners()
		await HallOfFame()
		await attendFeasts()
		await payHomage()
		await doProcessions(30)
		await visitMaidens(20)
		await contributeAlliance()
		await doExpeditions(50)
		await getDailyRewards()
	} catch (e) {
		logger.error(e)
	}
}

// dailyChores().then(() => {process.exit()})
chores().then(() => {process.exit()})
