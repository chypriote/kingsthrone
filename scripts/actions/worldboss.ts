import chalk from 'chalk'
import { orderBy } from 'lodash'
import { goat } from '../services/requests'
const cliProgress = require('cli-progress')

export enum FIGHT_STATUS {
	BATTLE_ENDED= 0,
	HERO_RESTING= 1,
	ONGOING=2,
}


export const doMinions = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const sorted = orderBy(heroes, 'zfight_num', 'asc')

	const progress = new cliProgress.SingleBar({
		format: `Attacking Minions | ${chalk.green('{bar}')} | {value}/{total} heroes`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(heroes.length, 0)

	for (const hero of sorted) {
		try {
			const status = await goat.attackMinion(hero.id)
			if (status === FIGHT_STATUS.BATTLE_ENDED) { progress.stop(); return }
			progress.increment()
		} catch (e) {/*do nothing*/}
	}
}

export const doBoss = async (): Promise<void> => {
	const heroes = (await goat.getGameInfos()).hero.heroList
	const sorted = orderBy(heroes, 'zfight_num', 'asc')

	const progress = new cliProgress.SingleBar({
		format: `Attacking Jotun | ${chalk.green('{bar}')} | {value}/{total} heroes`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(heroes.length, 0)

	for (const hero of sorted) {
		try {
			const status = await goat.attackBoss(hero.id)
			if (status === FIGHT_STATUS.BATTLE_ENDED) { progress.stop(); return }
			progress.increment()
		} catch (e) {/*do nothing*/}
	}
}

export const doWorldBoss =  async (): Promise<void> => {
	const hours = (new Date()).getHours()

	if ([14, 15].includes(hours)) {
		await doMinions()
	}

	if ([22, 23].includes(hours)) {
		await doBoss()
	}
}
