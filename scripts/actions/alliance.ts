import { goat } from '../services/requests'
import { logger } from '../services/logger'
import { FIGHT_STATUS } from './worldboss'

const fightBosses = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const bosses = (await goat.getAllianceBossInfo()).filter(boss => boss.hp > 0)

	if (!bosses.length) { return }

	let i = 0
	for (const hero of heroes) {
		const status = await goat.fightAllianceBoss(bosses[i].id, hero.id)
		if (status === FIGHT_STATUS.BOSS_KILLED) { i++ }
	}
}

export const contributeAlliance = async (): Promise<void> => {
	try {
		await fightBosses()
		if (await goat.contributeAlliance())
			logger.success('Alliance contributed')
	} catch (e) {
		logger.error(`[ALLIANCE] ${e}`)
	}
}
