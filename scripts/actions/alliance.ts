import { find, orderBy } from 'lodash'
import { goat, AllianceBossInfo, Hero, AllianceShop } from 'kingsthrone-api'
import { FIGHT_STATUS } from 'kingsthrone-api/lib/types/WorldBoss'
import { ITEMS } from 'kingsthrone-api/lib/types/Item'
import { logger } from '../services/logger'
import { Progress } from '../services/progress'

interface UsedHero { id: number; h: number; f: number; }
const fightBosses = async (): Promise<void> => {
	const infos = await goat.alliance.getAllianceBossInfo()
	const bosses = infos.bosses.filter((boss: AllianceBossInfo) => boss.hp > 0)

	if (!bosses.length) { return }
	const heroes = (await goat.profile.getGameInfos()).hero.heroList
	const used = (infos.heroes).map((h: UsedHero) => h.id.toString())

	const available = orderBy(
		heroes.filter((h: Hero) => !used.includes(h.id.toString())),
		'zfight_num',
		'asc'
	)

	if (!available.length) { return }

	const progress = new Progress('Alliance Boss', heroes.length, 'heroes')

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
		if (e.toString() === 'Error: Unlock at Alliance Level 3') { return }
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

		for (const item of [81, ITEMS.CITRINE_RING, ITEMS.CITRINE_SCEPTER]) {
			await buyItem(item)
		}
	} catch (e) {
		if (e.toString() === 'Error: Insufficient Contribution') { return }
		logger.error(`[ALLYSHOP] ${e.toString()}`)
		console.log(e)
	}
}

const xServerFight = async (): Promise<void> => {
	await fightXServer()
	const rwdStatus = await goat.alliance.getXServerRewardInfos()
	try {
		if (rwdStatus.isWin === 1 && rwdStatus.isGet === 0 && rwdStatus.is_get !== 0) {
			await goat.alliance.claimXServerReward()
			logger.success('got Reward')
		}
	} catch (e) {
		if (e.toString() === 'Error: Haven\'t joined the fight') { return }
		logger.error(e.toString())
	}
}

export const contributeAlliance = async (): Promise<void> => {
	try {
		await fightBosses()
		if (await goat.alliance.contributeAlliance())
			logger.success('Alliance contributed')
		await buyContributionItem()
		await xServerFight()
	} catch (e) {
		if (e.toString() === 'Error: Unlock at Alliance Level 3') { return }
		logger.error(`[ALLIANCE] ${e}`)
	}
}
