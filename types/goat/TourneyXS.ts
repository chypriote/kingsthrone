import { User } from '../goatGeneric'
import { ITourneyFight, ITourneyInfos, ITourneyResult, ITourneyStatus } from './Tourney'

export type XSTourneyInfos = {
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
	fight: XSTourneyFight
}


interface XSTourneyFight extends ITourneyFight {
	fstate: number
}

export interface XSOngoingFight extends ITourneyStatus {
	win: ITourneyResult
	fight: XSTourneyFight
	info: ITourneyInfos
	myrank: {
		rank: number
		score: number
	}
}
