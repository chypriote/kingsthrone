import chalk from 'chalk'
import { orderBy } from 'lodash'
import { goat } from 'kingsthrone-api'
import { Hero } from 'kingsthrone-api/lib/types/goat'

const cliProgress = require('cli-progress')

interface Mgft { id: number; h: number; f: number; }
export enum FIGHT_STATUS {
	BATTLE_ENDED = 0,
	HERO_RESTING = 1,
	ONGOING = 2,
	BOSS_KILLED = 3,
}

const getAvailableHeroes = async (): Promise<Hero[]> => {
	const infos = await goat.profile.getGameInfos()
	const heroes = infos.hero.heroList
	const used = (infos.wordboss.mgft).map((h: Mgft) => h.id.toString())

	return orderBy(
		heroes.filter((h: Hero) => !used.includes(h.id.toString())),
		'zfight_num',
		'asc'
	)
}

export const doMinions = async (): Promise<void> => {
	const heroes = await getAvailableHeroes()

	if (!heroes.length) { return }
	const progress = new cliProgress.SingleBar({
		format: `Attacking Minions\t| ${chalk.green('{bar}')} | {value}/{total} heroes`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(heroes.length, 0)

	for (const hero of heroes) {
		try {
			const status = await goat.worldBoss.attackMinion(hero.id)
			if (status === FIGHT_STATUS.BATTLE_ENDED) { progress.stop(); return }
			progress.increment()
		} catch (e) {/*do nothing*/ }
	}
	progress.stop()
}

export const doBoss = async (): Promise<void> => {
	const heroes = await getAvailableHeroes()

	if (!heroes.length) { return }
	const progress = new cliProgress.SingleBar({
		format: `Attacking Jotun\t| ${chalk.green('{bar}')} | {value}/{total} heroes`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(heroes.length, 0)

	for (const hero of heroes) {
		try {
			const status = await goat.worldBoss.attackBoss(hero.id)
			if (status === FIGHT_STATUS.BATTLE_ENDED) { progress.stop(); return }
			progress.increment()
		} catch (e) {/*do nothing*/ }
	}
	progress.stop()
}

export const doWorldBoss = async (): Promise<void> => {
	const hours = (new Date()).getHours()

	if ([14, 15].includes(hours)) {
		await doMinions()
	}

	if ([22, 23].includes(hours)) {
		await doBoss()
	}
}
