import { clone, find, orderBy } from 'lodash'
import { format, fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { ITourneyFight, ITourneyStatus, OpponentHero, OpponentHeroStats, RewardItem, TourneyShopItem, User } from 'kingsthrone-api'

import { PlayerHero } from '../../types/strapi/PlayerHero'
import { Hero } from '../../types/strapi/Hero'
import { logger } from '../services/logger'
import { Progress } from '../services/progress'
import { getExistingHeroesList } from '../repository/hero'
import { getRoster, updatePlayerHero } from '../repository/player-heroes'
import { getOrCreatePlayerFromGoat } from '../repository/player'
import { deathmatchEndpoint, LocalTourneyEndpoint, TourneyEndpoint, xsTourneyEndpoint } from './index'
const chalk = require('chalk')

export enum TOURNEY_TYPE {
	LOCAL = 'local',
	XSERVER = 'xserver',
	DEATHMATCH = 'deathmatch',
}

class HeroStatus {
	hero: Hero | null = null
	hp: number
	hpmax: number
	atkbonus: number
	skillbonus: number
	kills: number
	opponents: number

	constructor() {
		this.hp = 0
		this.hpmax = 0
		this.atkbonus = 0
		this.skillbonus = 0
		this.kills = 0
		this.opponents = 0
	}

	setHero(hero: Hero): this {
		this.hero = hero
		return this
	}
	updateFromFight(fight: ITourneyFight): this {
		this.hp = fight.hp
		this.hpmax = fight.hpmax
		this.atkbonus = fight.ackadd
		this.skillbonus = fight.skilladd
		this.kills = fight.killnum
		this.opponents = fight.fheronum
		return this
	}
	toString() {
		return `Status: HP ${Math.round((this.hp / this.hpmax) * 100)}% - Attack: +${this.atkbonus}% - Crit: +${this.skillbonus}% - Fight: ${
			this.kills + 1
		}/${this.opponents}`
	}
}
class GlobalState {
	type: TOURNEY_TYPE = TOURNEY_TYPE.LOCAL
	endpoint: TourneyEndpoint = new LocalTourneyEndpoint()
	status: HeroStatus

	heroes: Hero[]
	opponent?: User
	totalHeroes: number
	easyFight: boolean
	currentFight: number
	fought: OpponentHeroStats[]
	rewards: RewardItem[]
	opponentRoster: PlayerHero[]
	progress?: Progress

	constructor() {
		this.totalHeroes = 0
		this.heroes = []
		this.easyFight = false
		this.currentFight = 1
		this.fought = []
		this.rewards = []
		this.opponentRoster = []
		this.status = new HeroStatus()
	}

	setEndpoint(endpoint: TourneyEndpoint) {
		this.endpoint = endpoint
		return this
	}
	setType(type: TOURNEY_TYPE) {
		this.type = type
		return this
	}
}
const state = new GlobalState()
const boughtItems = [
	{ id: 1, name: 'Adrenaline Boost', min: 49 },
	{ id: 4, name: 'Endurance Boost I', min: 5 },
	// { id: 5, name: 'Expertise Boost I', min: 10 },
	// { id: 6, name: 'Adrenaline Boost I', min: 9 },
	{ id: 7, name: 'Endurance Boost II', min: 9 },
	// { id: 8, name: 'Expertise Boost II', min: 15 },
	// { id: 9, name: 'Adrenaline Boost II', min: 14 },
	//2, //+100 attack, 50gems
	//3, //+150 attack, 100gems
	//11, //+26 crit, 20gems Expertise Boost III
	//12, //+18 attack, 20gems
	//15, Endurance Boost III
]

const loopFight = async (status: ITourneyStatus) => {
	if (!state.opponent) {
		return logger.error('no opponent')
	}

	const fight = status.fight

	state.status.updateFromFight(fight)
	try {
		await buyShop(fight.shop)
	} catch (e) {
		if (e.toString() !== 'Error: Has been purchased')
			logger.error(`Couln't buy from shop: ${e.toString()}`)
	}

	// displayFightStatus(fight)

	const hero = await selectHero(fight.fheros)
	const battle = await state.endpoint.fightHero(hero)
	if (!battle.win) {throw new Error('No fight result ?!')}
	await saveOpponentHeroStats(hero, battle.win.fight.base)
	state.progress?.increment()
	await handleRewards(battle)

	if (battle.win.over?.isover) {
		state.progress?.stop()
		return battle.win.over.win
			? logger.success(`Fight won, got ${rewardsSummary()}`)
			: logger.alert(`Fight lost after ${state.currentFight} fights, got ${rewardsSummary(false)}`)
	}
	if (!battle.fight.fheronum) {
		state.progress?.stop()
		return logger.success(`Fight won ${state.currentFight}, got ${rewardsSummary()}`)
	}

	try {
		state.currentFight++
		await loopFight(battle)
	} catch (e) {
		logger.error(e.toString())
		console.log(JSON.stringify(battle))
	}
}

const rewardsSummary = (won = true): string => {
	let qp = 0
	let xp = won ? 2 : 0
	let token = 0
	for (const reward of state.rewards) {
		if ([4, 6, 17].includes(reward.id) || reward.kind === 6) {
			xp += reward.count
		}
		if ([18, 27].includes(reward.id) || reward.kind === 5) {
			qp += reward.count
		}
		if (reward.id === 123) {
			token += reward.count
		}
	}

	return `${qp} quality, ${xp} tourney xp, ${token} tokens`
}
/** Rewards */
const handleRewards = async (battle: ITourneyStatus): Promise<void> => {
	if (!battle.win || !battle.win.fight.winnum || battle.win.fight.winnum % 3 || battle.win.over?.isover) {
		return
	}

	const reward = (await state.endpoint.getReward()).items[0]
	state.rewards.push(reward)
}
/** Tries to guess the quality of the hero */
const inferQuality = (hero: OpponentHero): number => {
	switch (true) {
	case hero.heroLv >= 400: return 1000
	case hero.heroLv >= 350: return 600
	case hero.heroLv >= 300: return 200
	case hero.heroLv >= 250: return 100
	case hero.heroLv >= 200: return 40
	default: return 20
	}
}
/** Selects the easiest hero to fight using known roster and current level */
const selectHero = async (heroes: OpponentHero[]): Promise<OpponentHero> => {
	for (const hero of heroes) {
		const found = find(state.opponentRoster, (ph) => ph.hid == hero.id)
		if (!found) return hero
	}

	heroes = heroes.map((h) => {
		const found = find(state.opponentRoster, (ph) => ph.hid == h.id)
		return { ...h, quality: found?.quality || inferQuality(h) }
	})

	const hero = orderBy(heroes, ['quality', 'senior', 'heroLv', 'skin'], ['asc', 'asc', 'asc', 'asc'])[0]
	hero.name = find(state.heroes, (h) => h.hid == hero.id)?.name || hero.id

	return hero
}
/** Saves the opponent hero's stats to database */
const saveOpponentHeroStats = async (hero: OpponentHero, stats: OpponentHeroStats[]) => {
	if (!state.opponent) {
		return logger.error('no opponent')
	}
	const opStats = find(stats, (h) => h.hid == hero.id && h.level == hero.heroLv && h.skin == hero.skin)
	if (!opStats) {
		logger.error(JSON.stringify(stats))
	} else {
		state.fought.push(opStats)
		await updatePlayerHero(opStats.hid, state.opponent.uid, opStats.azz)
	}
}
/** Buys an item in the shop */
const buyShop = async (shop: TourneyShopItem[]): Promise<void> => {
	const items = orderBy(shop, 'id', 'desc')

	if (state.easyFight && state.currentFight > 1) {
		// if (state.currentFight === 2) logger.log(chalk.cyan('Easy fight, not buying'))
		return
	}

	const status = state.status
	for (const item of items) {
		const buyable = find(boughtItems, (it) => {
			if (item.id == 4 || item.id == 7) {
				const missingHp = 100 - Math.round((status.hp / status.hpmax) * 100)
				return missingHp > 75 || (missingHp > item.add && item.add >= it.min)
			}

			return it.id == item.id && item.add >= it.min
		})

		if (buyable) {
			// logger.warn(`Buying item ${buyable.name} (+${item.add})`)
			state.status.updateFromFight((await state.endpoint.buyTourneyBoost(item)).fight)
			return
		}
	}
}
/**
 * Returns the current fight if there's an ongoing one,
 * otherwise starts a fight with the provided opponent,
 * or use a token to start a new one
 */
const startFighting = async (opponent: string | null, hid: number | null): Promise<ITourneyStatus | null> => {
	const status = await state.endpoint.getTourneyInfos()
	const currentState = status.info.state

	if ([11, 12, 14, 15].includes(currentState)) {
		logger.warn('fight already started')
		if (opponent) {
			logger.alert(`can't challenge ${opponent}`)
			return null
		}
		return status
	}

	if (opponent) {
		const hero = hid ? { id: hid } : await state.endpoint.findAvailableHero()
		if (!hero) {
			logger.alert('No more heroes available')
			return null
		}
		return await state.endpoint.challengeOpponent(opponent, hero.id)
	}

	if (currentState === 1) {
		logger.alert(`Tourney not ready, awaiting ${format(fromUnixTime(status.info.cd.next), 'HH:mm')}`)
		return null
	}

	if (currentState === 3) {
		logger.log('Daily fights over, using token')
		try {
			return await state.endpoint.startTokenTourneyFight()
		} catch (e) {
			console.log(e.toString())
			return null
		}
	}

	if (currentState === 4) {
		logger.warn('Daily fights over, token fights over, use challenges')
		return null
	}
	if (currentState === 0) {
		logger.warn('Truce phase')
		return null
	}

	if (currentState !== 2 && currentState !== 0) {
		logger.error(`Unknown state: ${currentState}`)
		return null
	}

	return await state.endpoint.startTourneyFight()
}
/** Creates or updates the player in database and load its roster  */
const loadFight = async (fight: ITourneyFight): Promise<void> => {
	const uid = fight.fuser.uid
	await getOrCreatePlayerFromGoat(uid)

	const hero = find(state.heroes, (h) => h.hid == fight.hid)
	if (!hero) {
		logger.alert(`No hero found with id ${fight.hid}`)
		process.exit(1)
	}

	state.opponentRoster = await getRoster(uid)
	state.opponent = clone(fight.fuser)
	state.totalHeroes = clone(fight.fheronum)
	state.easyFight = fight.fuser.shili < 30000000
	state.status = new HeroStatus().setHero(clone(hero)).updateFromFight(fight)
	state.currentFight = 0
	state.rewards = []

	logger.log(`Fighting ${chalk.cyan(fight.fuser.name)} (${fight.fuser.uid}) with ${chalk.yellow(hero ? `${hero.name} (${hero.hid})` : fight.hid)}`)
	state.progress = new Progress(fight.fuser.name, state.totalHeroes)
}
const loadEndpoint = (type: TOURNEY_TYPE): void => {
	state.setType(type)
	switch (type) {
	//@ts-ignore
	case TOURNEY_TYPE.XSERVER: state.setEndpoint(new xsTourneyEndpoint()); break
	case TOURNEY_TYPE.DEATHMATCH: state.setEndpoint(new deathmatchEndpoint()); break
	case TOURNEY_TYPE.LOCAL:
	default: state.setEndpoint(new LocalTourneyEndpoint()); break
	}
}

export const allTourney = async (type: TOURNEY_TYPE = TOURNEY_TYPE.LOCAL, opponent: string | null = null): Promise<void> => {
	loadEndpoint(type)
	state.heroes = await getExistingHeroesList()
	const mine = await state.endpoint.getAvailableHeroesList()
	if ((await goat.profile.getGameInfos()).hero.heroList.length < 15) {
		return
	}
	for (const h of mine) {
		const status = await startFighting(opponent, h.id)
		if (!status) {
			return
		}
		await loadFight(status.fight)
		await loopFight(status)
	}
}

export const doTourney = async (
	type: TOURNEY_TYPE = TOURNEY_TYPE.LOCAL,
	opponent: string | null = null,
	hid: number | null = null
): Promise<void> => {
	loadEndpoint(type)
	state.heroes = await getExistingHeroesList()
	if ((await goat.profile.getGameInfos()).hero.heroList.length < 15) {
		return
	}
	const status = await startFighting(opponent, hid)
	if (!status) {
		return
	}
	await loadFight(status.fight)
	await loopFight(status)
}
