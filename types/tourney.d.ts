import { User } from './goatGeneric'

export type TourneyInfos = {
	info: {
		state: number
		cd: {next: number, label: string}
		totalNum: number
		fitnum: number
		chunum: number
		chumax: number
		qhid: number
		fuser: User[]
	}
	daily: {
		wins: number
		rwds: { id: number, rwd: number }[]
		countdown: number
	}
	myrank:  { score: number, rank: number }
	deflog:  {
		uid: string
		name: string
		job: number
		sex: number
		level: number
		vip: number
		chenghao: number
		headframe: number
		headType: number
		headId: number
		vipStatus: number
		shili: number
		clubid: number
		clubname: string
		frame: number
		head: number
		chatframe: number
		id: number
		fscore: number
		kill: number
		win: number
		hid: number
		mscore: number
		dtime: number
	}[] //Revenges
	enymsg:  {id: number, fuser: User, score: number, time: number}[]
	hastz: any[]
	fclist: {id: number, h: number, f: number }[] //Used heroes
}


export type TourneyFight = {
	hid: number
	fuser: User
	fheros: FHero[]
	shop: FShop[]
	fstate: number
	ackadd: number
	skilladd: number
	hp: number
	hpmax: number
	killnum: number
	fheronum: number
	money: number //flames
	ackaddnum: number
	skilladdnum: number
	skilladdrate: number
}

export type TourneyDetails = {
	info: {
		state: number //1=awaiting next, 2=tourney ready
		cd: {
			next: number
			label: string
		}
		totalNum: number
		fitnum: number
		chunum: number
		chumax: number
		qhid: number
		fuser: User //next opponent
	}
	fight: TourneyFight
	daily: {
		wins: number //number of participations
		rwds: {id:number, rwd: number}[] //rewards
		countdown: number //countdown before reset
	}
	cslist: {f: number, h: number, id: number}[]
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

export type OngoingFight = {
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
	fight: TourneyFight
	info:  {
		state: number //1=awaiting next, 2=tourney ready
		cd: {
			next: number
			label: string
		}
		totalNum: number
		fitnum: number
		chunum: number
		chumax: number
		qhid: number
		fuser: User //next opponent
	}
	myrank: {
		rank: number
		score: number
	}
}
export enum TOURNEY_REWARDS {
	CHALLENGE_TOKEN= 123,
	TOURNEY_EXP= 18,
	QUALITY_EXP=17
}
type TourneyRewardItem = {count: number, id: number, kind: number}
export type TourneyReward = {
	items: TourneyRewardItem[]
	jiade: TourneyRewardItem[]
}
