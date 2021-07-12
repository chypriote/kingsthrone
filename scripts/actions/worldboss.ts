import { orderBy } from 'lodash'
import { goat } from '../services/requests'
import { logger } from '../services/logger'

export enum FIGHT_STATUS {
	BATTLE_ENDED= 0,
	HERO_RESTING= 1,
	ONGOING=2,
}

export const doMinions = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const sorted = orderBy(heroes, 'zfight_num', 'asc')

	for (const hero of sorted) {
		try {
			const status = await goat.attackMinion(hero.id)
			if (status === FIGHT_STATUS.BATTLE_ENDED) { return }
			if (status === FIGHT_STATUS.HERO_RESTING) { continue }
			logger.debug(`Attacked minion with hero ${hero.id}`)
		} catch (e) {/*do nothing*/}
	}
}

export const doBoss = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const sorted = orderBy(heroes, 'zfight_num', 'asc')

	for (const hero of sorted) {
		try {
			const status = await goat.attackBoss(hero.id)
			if (status === FIGHT_STATUS.BATTLE_ENDED) { return }
			if (status === FIGHT_STATUS.HERO_RESTING) { continue }
			logger.debug(`Attacked boss with hero ${hero.id}`)
		} catch (e) {/*do nothing*/}
	}
}

export const doWorldBoss =  async (): Promise<void> => {
	const hours = (new Date()).getHours()

	if ([14, 15].includes(hours)) {
		logger.debug('Starting Jotun Minions fight')
		await doMinions()
	}

	if ([22, 23].includes(hours)) {
		logger.debug('Starting Jotun fight')
		await doBoss()
	}
}
