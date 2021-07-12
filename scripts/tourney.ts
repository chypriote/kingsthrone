import chalk from 'chalk'
import { format, fromUnixTime } from 'date-fns'
import { clone, find, orderBy, sample } from 'lodash'
import { User } from '~/types/goatGeneric'
import { FHero, FHeroStats, FShop, OngoingFight, TourneyFight, TourneyRewardItem } from '~/types/tourney'
import { Hero } from '~/types/Hero'
import { PlayerHero } from '~/types/PlayerHero'
import { Hero as GHero } from '~/scripts/repository/roster'

import { goat, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'
import { getHeroesList } from './repository/hero'
import { getRoster, updatePlayerHero } from './repository/player-heroes'
import { getOrCreatePlayerFromGoat } from './repository/player'

let heroes: Hero[]

class HerosStatus {
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

	updateFromFight(fight: TourneyFight) {
		this.hp = fight.hp
		this.hpmax = fight.hpmax
		this.atkbonus = fight.ackadd
		this.skillbonus = fight.skilladd
		this.kills = fight.killnum
		this.opponents = fight.fheronum
	}

	toString() {
		return `Status: HP ${(this.hp / this.hpmax * 100).toFixed()}% - Attack: +${this.atkbonus}% - Crit: +${this.skillbonus}% - Fight: ${this.kills + 1}/${this.opponents}`
	}
}
interface IState {
	hero?: Hero
	opponent?: User
	totalHeroes: number
	easyFight: boolean
	currentFight: number
	fought: FHeroStats[]
	rewards: TourneyRewardItem[]
	status: HerosStatus
	opponentRoster: (PlayerHero & {hid: number})[]
}
const state: IState = {
	totalHeroes: 0,
	easyFight: false,
	currentFight: 1,
	fought: [],
	rewards: [],
	opponentRoster: [],
	status: new HerosStatus(),
}

const boughtItems = [
	{ id: 1, name: 'Adrenaline Boost', min: 49 },
	// { id: 4, name: 'Endurance Boost I', min: 5 },
	// { id: 5, name: 'Expertise Boost I', min: 10 },
	// { id: 6, name: 'Adrenaline Boost I', min: 9 },
	// { id: 7, name: 'Endurance Boost II', min: 9 },
	// { id: 8, name: 'Expertise Boost II', min: 15 },
	// { id: 9, name: 'Adrenaline Boost II', min: 14 },
	//2, //+100 attack, 50gems
	//3, //+150 attack, 100gems
	//11, //+26 crit, 20gems Expertise Boost III
	//12, //+18 attack, 20gems
	//15, Endurance Boost III
]

const getReward =(reward: TourneyRewardItem): string => {
	switch (true) {
	case reward.id === 4:
	case reward.id === 6:
	case reward.id === 17:
	case reward.id === 7 && reward.kind === 6:
	case reward.kind === 6:
		return `${reward.count} tourney xp`
	case reward.id === 18:
	case reward.id ===27:
	case reward.id === 7 && reward.kind === 5:
	case reward.kind === 5:
		return `${reward.count} quality points`
	case reward.id ===123: return `${reward.count} challenge tokens`
	default: return `unknown ${JSON.stringify(reward)}`
	}
}
const inferQuality = (hero: FHero): number => {
	switch (true) {
	case hero.heroLv >= 400: return 1000
	case hero.heroLv >= 350: return 600
	case hero.heroLv >= 300: return 200
	case hero.heroLv >= 250: return 100
	case hero.heroLv >= 200: return 40
	default: return 20
 	}
}
const buyShop = async (shop: FShop[]): Promise<void> => {
	const items = orderBy(shop, 'id', 'desc')

	if (state.easyFight && state.currentFight > 1) {
		if (state.currentFight === 2) logger.log(chalk.cyan('Easy fight, not buying'))
		return
	}

	const status = state.status
	for (const item of items) {
		const buyable = find(boughtItems, it => {
			if (item.id == 4 || item.id == 7) {
				return 100 - (status.hp / status.hpmax * 100) > item.add && item.add >= it.min
			}

			return it.id == item.id && item.add >= it.min
		})

		if (buyable) {
			logger.warn(`Buying item ${buyable.name} (+${item.add})`)
			state.status.updateFromFight((await goat.buyTourneyBoost(item)).fight)
			return
		}
	}
}
const selectHero = (heroes: FHero[]): FHero => {
	heroes = heroes.map(h => {
		const found = find(state.opponentRoster, ph => ph.hid == h.id)
		return { ...h, quality: found?.quality || inferQuality(h) }
	})

	const sorted = orderBy(heroes, ['quality', 'senior', 'heroLv', 'skin'], ['asc', 'asc', 'asc', 'asc'])

	return sorted[0]
}
const findAvailableHero = async (): Promise<GHero|null> => {
	const info = await goat.getGameInfos()
	const heroes = info.hero.heroList
	const used = info.yamen.fclist.map(u => u.id)

	const available = heroes.filter(h => !used.includes(h.id))
	if (!available.length) {
		return null
	}

	return sample(available) || null
}
const displayStatus = (fight: TourneyFight) => {
	logger.log(state.status.toString())

	const mapped = fight.fheros.map(fh => {
		const hero = find(heroes, h => h.hid == fh.id)
		return { ...fh, name: hero?.name || fh.id }
	})

	logger.log(`Opponents: ${mapped.map(h => `${h.name} (${h.heroLv})`).join(' | ')}`)
}

const doFight = async (status: OngoingFight) => {
	if (!state.opponent) { return logger.error('no opponent') }

	logger.log('---------------------------------------')
	const fight = status.fight

	state.status.updateFromFight(status.fight)

	// Preparing for fight
	await buyShop(fight.shop)
	displayStatus(fight)

	// Selecting opponent
	const op = selectHero(fight.fheros)
	op.name = find(heroes, h => h.hid == op.id)?.name || op.id
	logger.warn(`Challenging ${op.name}`)
	const battle = await goat.fightHero(op)

	// Handling opponent's stats
	const opStats = find(battle.win.fight.base, h => h.hid == op.id && h.level == op.heroLv && h.skin == op.skin)
	if (!opStats) {
		logger.error(JSON.stringify(battle.win.fight.base))
	} else {
		state.fought.push(opStats)
		await updatePlayerHero(opStats.hid, state.opponent?.uid, opStats.azz)
	}

	// Getting rewards
	if (battle.win.fight.winnum && battle.win.fight.winnum % 3 === 0) {
		const reward = (await goat.getReward()).items[0]
		state.rewards.push(reward)
		logger.success(`Got reward ${getReward(reward)}`)
	}

	// Handling fight result
	if (battle.win.over?.isover) {
		return battle.win.over.win ?
			logger.success(`Fight with ${chalk.bold(state.opponent?.name)} over, won ${state.currentFight} fights`) :
			logger.error(`Lost the battle with ${chalk.bold(state.opponent?.name)} after ${state.currentFight} fights`)
	}
	if (!battle.fight.fheronum) {
		return logger.success(`Fight with ${chalk.bold(state.opponent?.name)} over, won ${state.currentFight} fights`)
	}

	state.currentFight++
	try {
		// Fighting again
		await doFight(battle)
	} catch (e) {
		console.log(e)
		console.log(JSON.stringify(battle))
	}
}

const prepareFight = async (opponent: string|null, hid: number|null): Promise<OngoingFight> => {
	const status = await goat.getTourneyInfos()
	const state = status.info.state

	if (state === 11 || state === 12 || state === 14 || state === 15) {
		logger.warn('fight already started')
		if (opponent) {logger.error(`can't challenge ${opponent}`); process.exit(0)}
		return status
	}

	if (opponent) {
		const hero = hid ? { id: hid } : await findAvailableHero()
		return await goat.challengeOpponent(opponent, hero?.id || 0)
	}

	if (state === 1) {
		logger.error(`Tourney not ready, awaiting ${format(fromUnixTime(status.info.cd.next), 'HH:mm')}`)
		process.exit(0)
	}

	if (state === 3) {
		logger.log('Daily fights over, using token')
		return await goat.startTokenTourneyFight()
	}

	if (state === 4) {
		logger.error('Daily fights over, token fights over, use challenges')
		process.exit(0)
	}

	if (state !== 2) {
		logger.error(`Unknown state: ${state}`)
		process.exit(0)
	}

	return await goat.startTourneyFight()
}

export const loadOpponent = async (fight: TourneyFight): Promise<void> => {
	const uid = fight.fuser.uid
	await getOrCreatePlayerFromGoat(uid)

	state.opponent = clone(fight.fuser)
	state.totalHeroes = clone(fight.fheronum)
	state.easyFight = fight.fuser.shili < 10000000
	state.status.updateFromFight(fight)
	state.opponentRoster = await getRoster(uid)
}

export const doTourney = async (account: string, opponent: string|null = null, hid: number|null = null): Promise<void> => {
	await goat.login(account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

	const status = await prepareFight(opponent, hid ? hid : null)

	heroes = await getHeroesList()
	const hero = find(heroes, h => h.hid == status.fight.hid)

	state.hero = clone(hero)
	await loadOpponent(status.fight)

	logger.log(`Fighting ${chalk.cyan(status.fight.fuser.name)} (${status.fight.fuser.uid}) with ${chalk.yellow(hero?.name || status.fight.hid)} against ${status.fight.fheronum} heroes`)
	await doFight(status)
	logger.debug(format(new Date(), 'HH:mm'))
}
