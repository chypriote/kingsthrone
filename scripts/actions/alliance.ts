import { goat, AllianceBossInfo, Hero } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { FIGHT_STATUS } from 'kingsthrone-api/lib/types/WorldBoss'
import { find, orderBy } from 'lodash'

const fightBosses = async (): Promise<void> => {
	const heroes = (await goat.profile.getGameInfos()).hero.heroList
	const bosses = (await goat.alliance.getAllianceBossInfo()).filter((boss: AllianceBossInfo) => boss.hp > 0)

	if (!bosses.length) { return }

	let i = 0
	for (const hero of heroes) {
		const status = await goat.alliance.fightAllianceBoss(bosses[i].id, hero.id)
		if (status === FIGHT_STATUS.BOSS_KILLED) { i++ }
	}
}

const fightXServer = async (): Promise<void> => {
	try {
		const fight = await goat.alliance.getXServerFight()
		const dispatched = find(fight.status.list, lord => lord.uid === goat._getGid())

		if (dispatched) { return }

		const heroes = (await goat.profile.getGameInfos()).hero.heroList
		const used = fight.heroes.map(h => h.id.toString())
		const hero = orderBy(
			heroes.filter((h: Hero) => !used.includes(h.id.toString())),
			'zfight_num',
			'asc'
		).pop()

		if (!hero) { return }
		await goat.alliance.dispatchXServerHero(hero.id)
		logger.success(`Dispatched ${JSON.stringify(hero)} to xserver fight`)
	} catch (e) {
		logger.error(`[XSERVER] error ${e.toString()}`)
		console.log(e)
	}
}

export const contributeAlliance = async (): Promise<void> => {
	try {
		await fightBosses()
		if (await goat.alliance.contributeAlliance())
			logger.success('Alliance contributed')
		await fightXServer()
	} catch (e) {
		logger.error(`[ALLIANCE] ${e}`)
	}
}
