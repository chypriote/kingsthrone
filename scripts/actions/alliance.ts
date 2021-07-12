import { goat } from '../services/requests'
import { logger } from '../services/logger'

const fightBosses = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const bosses = (await goat.getAllianceBossInfo()).filter(boss => boss.hp > 0)

	if (bosses.length) {
		for (const hero of heroes) {
			await goat.fightAllianceBoss(bosses[0].id, hero.id)
		}
	}
}

export const contributeAlliance = async (): Promise<void> => {
	try {
		await fightBosses()
		await goat.contributeAlliance()

		logger.success('Alliance contributed')
	} catch (e) {
		logger.error(`[ALLIANCE] ${e}`)
	}
}
