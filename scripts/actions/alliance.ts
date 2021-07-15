import { goat } from '../services/goat'
import { logger } from '../services/logger'
import { FIGHT_STATUS } from './worldboss'

const fightBosses = async (): Promise<void> => {
	const heroes = (await goat.profile.getGameInfos()).hero.heroList
	const bosses = (await goat.alliance.getAllianceBossInfo()).filter(boss => boss.hp > 0)

	if (!bosses.length) { return }

	let i = 0
	for (const hero of heroes) {
		const status = await goat.alliance.fightAllianceBoss(bosses[i].id, hero.id)
		if (status === FIGHT_STATUS.BOSS_KILLED) { i++ }
	}
}

export const contributeAlliance = async (): Promise<void> => {
	try {
		await fightBosses()
		if (await goat.alliance.contributeAlliance())
			logger.success('Alliance contributed')
	} catch (e) {
		logger.error(`[ALLIANCE] ${e}`)
	}
}
