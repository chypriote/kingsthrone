import { format, fromUnixTime } from 'date-fns'
import { clone, find, orderBy, sample } from 'lodash'
import { FHero, FHeroStats, FShop, OngoingFight, TourneyFight, TourneyRewardItem } from '~/types/tourney'
import { Hero } from '~/types/Hero'
import { Hero as GHero } from '~/scripts/repository/roster'

import { client, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'
import { getHeroesList } from './repository/hero'
import { updatePlayerHero } from './repository/player-heroes'
import chalk from 'chalk'
import { User } from '~/types/goat'

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
}
const state: IState = {
	totalHeroes: 0,
	easyFight: false,
	currentFight: 1,
	fought: [],
	rewards: [],
	status: new HerosStatus(),
}

const boughtItems = [
	{ id: 1, name: 'Adrenaline Boost', min: 49 },
	{ id: 4, name: 'Endurance Boost I', min: 6 },
	{ id: 5, name: 'Expertise Boost I', min: 10 },
	{ id: 6, name: 'Adrenaline Boost I', min: 9 },
	{ id: 7, name: 'Endurance Boost II', min: 10 },
	{ id: 8, name: 'Expertise Boost II', min: 15 },
	{ id: 9, name: 'Adrenaline Boost II', min: 14 },
	//2, //+100 attack, 50gems
	//3, //+150 attack, 100gems
	//11, //+26 crit, 20gems Expertise Boost III
	//12, //+18 attack, 20gems
	//15, Endurance Boost III
]

const getReward =(reward: TourneyRewardItem): string => {
	switch (reward.id) {
	case 17: return `${reward.count} tourney xp`
	case 18: return `${reward.count} quality points`
	case 123: return `${reward.count} challenge tokens`
	default: return `unknown ${JSON.stringify(reward)}`
	}
}
const buyShop = async (shop: FShop[]): Promise<void> => {
	const items = orderBy(shop, 'id', 'desc')

	if (state.easyFight && state.currentFight > 1) {
		if (state.currentFight === 2) console.log('Easy fight, not buying')
		return
	}

	const status = state.status
	for (const item of items) {
		const buyable = find(boughtItems, it => {
			if (item.id == 4 || item.id == 7) {
				return (status.hp / status.hpmax * 100) < item.add
			}

			return it.id == item.id && item.add >= it.min
		})

		if (buyable) {
			logger.warn(`Buying item ${buyable.name} (+${item.add})`)
			state.status.updateFromFight((await client.buyTourneyBoost(item)).fight)
			return
		}
	}

	return console.log('not buying')
}
const selectHero = (heroes: FHero[]): FHero => {
	const sorted = orderBy(heroes, ['senior', 'heroLv', 'skin'])
	return sorted[0]
}
const findAvailableHero = async (): Promise<GHero|null> => {
	const info = await client.getGameInfos()
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
	if (!state.opponent) { return console.log('no opponent') }

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
	const battle = await client.fightHero(op)

	// Handling opponent's stats
	const opStats = find(battle.win.fight.base, h => h.hid == op.id && h.level == op.heroLv && h.skin == op.skin)
	if (!opStats) {
		logger.error(JSON.stringify(battle.win.fight.base))
	} else {
		console.log(`${op.name} has ${opStats.azz} quality`)
		state.fought.push(opStats)
		await updatePlayerHero(opStats.hid, state.opponent?.uid, opStats.azz)
	}

	// Getting rewards
	if (battle.win.fight.winnum % 3 === 0) {
		const reward = (await client.getReward()).items[0]
		state.rewards.push(reward)
		logger.success(`Got reward ${getReward(reward)}`)
	}

	// Handling fight result
	if (battle.win.over?.isover) {
		return battle.win.over.win ?
			logger.success(`Fight with ${state.opponent?.name} over, won ${state.currentFight} fights`) :
			logger.error(`Lost the battle with ${state.opponent?.name} after ${state.currentFight + 1} fights`)
	}
	if (!battle.fight.fheronum) {
		return logger.success(`Fight with ${state.opponent?.name} over, won ${state.currentFight} fights`)
	}

	state.currentFight++
	// Fighting again
	await doFight(battle)
}

const prepareFight = async (opponent: string|null): Promise<OngoingFight> => {
	const status = await client.getTourneyInfos()
	const state = status.info.state

	if (state === 11 || state === 12) {
		console.log('fight already started')
		if (opponent) {logger.error(`can't challenge ${opponent}`); process.exit(0)}
		return status
	}

	if (opponent) {
		const hero = await findAvailableHero()
		return await client.challengeOpponent(opponent, hero?.id || 0)
	}

	if (state === 1) {
		logger.error(`Tourney not ready, awaiting ${format(fromUnixTime(status.info.cd.next), 'HH:mm')}`)
		process.exit(0)
	}

	if (state === 3) {
		console.log('Daily fights over, using token')
		return await client.startTokenTourneyFight()
	}

	if (state === 4) {
		logger.error('Daily fights over, token fights over, use challenges')
		process.exit(0)
	}

	if (state !== 2) {
		logger.error(`Unknown state: ${state}`)
		process.exit(0)
	}

	return await client.startTourneyFight()
}

export const doTourney = async (opponent: string|null = null): Promise<void> => {
	await client.login(LOGIN_ACCOUNT_NAPOLEON)

	const status = await prepareFight(opponent)

	heroes = await getHeroesList()
	const hero = find(heroes, h => h.hid == status.fight.hid)

	state.hero = clone(hero)
	state.opponent = clone(status.fight.fuser)
	state.totalHeroes = clone(status.fight.fheronum)
	state.easyFight = status.fight.fuser.shili < 10000000
	state.status.updateFromFight(status.fight)

	console.log(`Fighting ${chalk.cyan(status.fight.fuser.name)} (${status.fight.fuser.uid}) with ${chalk.yellow(hero?.name || status.fight.hid)} against ${status.fight.fheronum} heroes`)
	await doFight(status)
}

doTourney(process.argv[2]).then(() => process.exit())
