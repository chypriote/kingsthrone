import chalk from 'chalk'
import { orderBy } from 'lodash'
import { FIGHT_STATUS, goat } from 'kingsthrone-api'
import { Hero } from 'kingsthrone-api/lib/types/goat'

const cliProgress = require('cli-progress')

interface UsedHero { id: number; h: number; f: number; }
enum FIGHT_TYPE {
	BOSS= 0,
	MINIONS= 1,
}

const getAvailableHeroes = async (type: FIGHT_TYPE): Promise<Hero[]> => {
	const infos = await goat.profile.getGameInfos()
	const heroes = infos.hero.heroList
	const used = (infos.wordboss[type === FIGHT_TYPE.BOSS ? 'g2dft' : 'mgft']).map((h: UsedHero) => h.id.toString())

	return orderBy(
		heroes.filter((h: Hero) => !used.includes(h.id.toString())),
		'zfight_num',
		'asc'
	)
}

const doMinions = async (): Promise<void> => {
	const heroes = await getAvailableHeroes(FIGHT_TYPE.MINIONS)

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

const doBoss = async (): Promise<void> => {
	const heroes = await getAvailableHeroes(FIGHT_TYPE.BOSS)

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

	await buyItems()

	progress.stop()
}

const buyItems = async (): Promise<void> => {
	try {
		// 3 manuscript cache
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		// 4 manuscript pages
		await goat.worldBoss.buyItem(7)
		await goat.worldBoss.buyItem(7)
		await goat.worldBoss.buyItem(7)
		await goat.worldBoss.buyItem(7)
		// 3 ruby ring
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		// 3 ruby scepter
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		// 3 ruby sword
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		await goat.worldBoss.buyItem(6)
		// 3 earrings
		await goat.worldBoss.buyItem(10)
		await goat.worldBoss.buyItem(10)
		await goat.worldBoss.buyItem(10)
		// 8 ball gowns
		for (let i = 0; i < 8; i++) {await goat.worldBoss.buyItem(12)}
	} catch (e) {
		console.log(`Items not bought because ${e.toString()}`)
	}
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
