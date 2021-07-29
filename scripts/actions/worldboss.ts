import { orderBy } from 'lodash'
import { goat, Hero } from 'kingsthrone-api'
import { FIGHT_STATUS } from 'kingsthrone-api/lib/types/WorldBoss'
import { Progress } from '../services/progress'

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
	const progress = new Progress('Attacking Minions', heroes.length, 'heroes')

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
	const progress = new Progress('Attacking Jotun', heroes.length, 'heroes')

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

export enum BOSS_SHOP {
	RUBY_RING= 1,
	RUBY_SCEPTER= 2,
	RUBY_SWORD= 3,
	UNDEC_TOME_II= 4,
	UNDEC_TOME_III= 5,
	MANUSCRIPT_CACHE= 6,
	MANUSCRIPT_PAGE= 7,
	EXP_PACK= 8,
	PRECIOUS_NECKLACE= 9,
	PRICELESS_EARRINGS= 10,
	PERFUME= 11,
	BALL_GOWN= 12,
}

const buyXItems = async (id: number, count = 1): Promise<void> => {
	for (let i = 0; i < count; i++) {await goat.worldBoss.buyItem(id)}
}
const buyItems = async (): Promise<void> => {
	try {
		await buyXItems(BOSS_SHOP.MANUSCRIPT_CACHE, 10)
		await buyXItems(BOSS_SHOP.MANUSCRIPT_PAGE, 4)
		await buyXItems(BOSS_SHOP.RUBY_RING, 3)
		await buyXItems(BOSS_SHOP.RUBY_SCEPTER, 3)
		await buyXItems(BOSS_SHOP.RUBY_SWORD, 3)
		await buyXItems(BOSS_SHOP.PRICELESS_EARRINGS, 3)
		await buyXItems(BOSS_SHOP.BALL_GOWN, 8)
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
