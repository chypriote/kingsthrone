import { User } from '../goatGeneric'

type DMTourneyFight = {
	hid: number
	fuser: User
	fheros: FHero[]
	fheronum: number
	fstate: number
	hp: number
	hpmax: number
	killnum: number
	money: number //flames
	shop: FShop[]
	ackadd: number
	ackaddnum: number
	skilladd: number
	skilladdnum: number
	skilladdrate: number
}
export enum BoostType {
	ATTACK_POWER= 0,
	FLAMES= 1
}
export type FShop =  {
	id: number
	type: BoostType
	add: number
}
export type FHero =  {
	id: number
	senior: number
	skin: number
	dt: number
	heroLv: number
	name?: string|number
}
export type FHeroStats = {
	azz: number
	dt: number
	hid: number
	hp: number
	hpmax: number
	level: number
	skin: number
}
export type FResult = {
	base: FHeroStats[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items: any[], log: any[]
	nrwd: number
	win: number
	winnum: number
}

export type DMOngoingFight = {
	win:  {
		over: {
			fuser: User
			hid: number
			killnum: number
			win: number
			isover: number
		}| null
		fight: FResult
	}
	fight: DMTourneyFight

	cfg: {
		lun: number
		state: number
		zd_state: number
		sever: {sid: number}[] //servers list
		rwd: any[]
		lunshu: {id: number, msg: string, num: number, time: number}[]
		cd: {next: number, label: string}
	}
	clublist: {
		cid: string //aid
		cname: string
		id: number
		sy: number
		total: number
	}[]
	fclist: unknown
	info:  {
		state: number //0 = ready
		cd: {next: number, label: string}
		fitnum: number
		chunum: number
		chumax: number
		qhid: number
		fuser: User //next opponent
	}
	user: {
		cid: string
		qualify: number
		rid: number
		score: number
		win: number
	}
	kill20log: {
		dkill: number
		ftype: number
		fuser: User
		hid: number
		id: number
		kill: number
		ktime: number
		lkill: number
		user: User
		win: number
	}[]
	userList: {
		c: string //server
		n: string //name
		u: string //uid
	}[]
	cslist: {f: number, h: number, id: number}
}
export enum TOURNEY_REWARDS {
	CHALLENGE_TOKEN= 123,
	TOURNEY_EXP= 18,
	QUALITY_EXP=17
}
type TourneyRewardItem = {count: number, id: number, kind: number}
export type DMTourneyReward = {
	items: TourneyRewardItem[]
	jiade: TourneyRewardItem[]
}
type DMRank = {
	cid: string
	name: string
	rid: number
	score: number
	uid: string
}
export type DMRanking = {
	clubRankList: {
		cid: string
		name: string
		rid: number
		score: number
	}
	dielist: DMRank[]
	scorelist: DMRank[]
}
