import { User, Item } from '../goatGeneric'

export interface ITourneyResult {
	over: {
		fuser: User
		hid: number
		killnum: number
		win: number
		isover: number
	}| null
	fight: {
		base: OpponentHeroStats[]
		items: Item[], log: string[]
		nrwd: number
		win: number
		winnum: number
	}
}
export interface ITourneyFight { //===TourneyFight
	hid: number
	fuser: User
	fheros: OpponentHero[]
	shop: ShopItem[]
	hp: number
	hpmax: number
	ackadd: number
	skilladd: number
	killnum: number
	fheronum: number
	money: number //flames
	ackaddnum: number
	skilladdnum: number
	skilladdrate: number
}
export interface ITourneyInfos {
	state: number
	cd: { next: number, label: string }
	totalNum: number
	fitnum: number
	chunum: number
	chumax: number
	qhid: number
	fuser: User
}
export interface ITourneyStatus { //===OngoingFight
	win: ITourneyResult
	fight: ITourneyFight
	info: ITourneyInfos
	//myrank
}

/** OpponentHero */
export interface OpponentHero {
	id: number
	senior: number
	skin: number
	dt: number
	heroLv: number
	name?: string|number
}
export interface OpponentHeroStats {
	azz: number
	dt: number
	hid: number
	hp: number
	hpmax: number
	level: number
	skin: number
}
/** Shop **/
declare enum BoostType {
	ATTACK_POWER= 0,
	FLAMES= 1
}
export interface ShopItem {
	id: number
	type: BoostType
	add: number
}
/** Rewards **/
export type RewardItem = {count: number, id: number, kind: number}
export type Reward = {
	items: RewardItem[]
	jiade: RewardItem[]
}
