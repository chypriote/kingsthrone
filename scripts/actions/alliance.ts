import { find, orderBy } from 'lodash'
import chalk = require('chalk')
import { goat, AllianceBossInfo, Hero, AllianceShop } from 'kingsthrone-api'
import { FIGHT_STATUS } from 'kingsthrone-api/lib/types/WorldBoss'
import { ITEMS } from 'kingsthrone-api/lib/types/Item'
import { logger } from '../services/logger'
const cliProgress = require('cli-progress')

const fightBosses = async (): Promise<void> => {
	const heroes = (await goat.profile.getGameInfos()).hero.heroList
	const bosses = (await goat.alliance.getAllianceBossInfo()).filter((boss: AllianceBossInfo) => boss.hp > 0)

	if (!bosses.length) { return }

	const progress = new cliProgress.SingleBar({
		format: `Alliance Boss\t| ${chalk.green('{bar}')} | {value}/{total} heroes`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(heroes.length, 0)

	let i = 0
	for (const hero of heroes) {
		const status = await goat.alliance.fightAllianceBoss(bosses[i].id, hero.id)
		if (status === FIGHT_STATUS.BOSS_KILLED) { i++ }
		progress.increment()
	}
	progress.stop()
}

const fightXServer = async (): Promise<void> => {
	try {
		const fight = await goat.alliance.getXServerFight()
		const dispatched = find(fight.status.list, lord => lord.uid == goat._getGid())

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
		logger.success(`Dispatched ${hero.id} to xserver fight`)
	} catch (e) {
		logger.error(`[XSERVER] ${e.toString()}`)
		console.log(e)
	}
}


interface State {
	shopList: AllianceShop[],
	money: number
}
const state: State = {
	shopList: [],
	money: 0,
}

const buyItem = async (itemId: number): Promise<void> => {
	const item = find(state.shopList, it => it.item.id === itemId)
	if (!item) { return }

	for (let i = 0; i < item.num && state.money; i++) {
		await goat.alliance.buyAllianceShopItem(item.id)
		state.money -= item.payGX
	}
}

const buyContributionItem = async (): Promise<void> => {
	try {
		const alliance = await goat.alliance.getAllianceInfos()
		state.money = alliance.memberInfo.leftgx
		state.shopList = alliance.shopList

		for (const item of [81, ITEMS.CITRINE_RING]) {
			await buyItem(item)
		}
	} catch (e) {
		logger.error(`[ALLYSHOP] ${e.toString()}`)
		console.log(e)
	}
}

export const contributeAlliance = async (): Promise<void> => {
	try {
		await fightBosses()
		if (await goat.alliance.contributeAlliance())
			logger.success('Alliance contributed')
		await fightXServer()
		await buyContributionItem()
	} catch (e) {
		logger.error(`[ALLIANCE] ${e}`)
	}
}
