import { orderBy } from 'lodash'
import { goat } from '../services/requests'
import { logger } from '../services/logger'

export const doMinions = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const sorted = orderBy(heroes, 'zfight_num', 'asc')

	for (const hero of sorted) {
		try {
			if (!await goat.attackMinion(hero.id)) { return }
			logger.debug(`Attacked minion with hero ${hero.id}`)
		} catch (e) {/*do nothing*/}
	}
}

export const doBoss = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const sorted = orderBy(heroes, 'zfight_num', 'asc')

	for (const hero of sorted) {
		try {
			if (!await goat.attackBoss(hero.id)) { return }
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
