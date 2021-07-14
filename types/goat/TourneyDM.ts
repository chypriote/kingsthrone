import { User } from '../goatGeneric'
import { ITourneyFight, ITourneyInfos, ITourneyResult, ITourneyStatus } from './Tourney'
import { Item } from '~/types/goat/Item'

interface DMTourneyFight extends ITourneyFight {
	fstate: number
}

export interface DMOngoingFight extends ITourneyStatus {
	win: ITourneyResult
	fight: DMTourneyFight
	info: ITourneyInfos

	cfg: {
		lun: number
		state: number
		zd_state: number
		sever: {sid: number}[] //servers list
		rwd: Item[]
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
