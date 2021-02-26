import { Hero } from '~/scripts/repository/roster'

declare enum Sex {
	MALE= 2,
	FEMALE= 1
}
interface UserDetails {
	uid: number
	name: string
	job: string
	sex: Sex
	level: number
	exp: number
	vip: number
	cashbuy: number
	step: string
	guide: string
	cash: number
	coin: number
	food: number
	army: number
	bmap: number
	smap: number
	mkill: number
	xuanyan: string
	voice: number
	music: number
	regtime: string
	frame: number
	head: number
	chatframe: number
	mmap: number
	chenghao: number
	maxch: number
	headType: number
	headId: number
}
interface UserGuide {
	gnew: number
	smap: number
	mmap: number
	bmap: number
	getWife: number
}
interface GameStats {
	e1: number
	e2: number
	e3: number
	e4: number
}
interface GameStatsList {
	hero: GameStats
	wife: GameStats
	son: GameStats
}
interface OldGameStats {
	ep: number
	nowEp: number
	love: number
	nowLove: number
	flower: number
	nowFlower: number
}

export interface User {
	pvb: []
	headframe: { id: number }
	user: UserDetails
	guide: UserGuide
	newEmo: []
	ep: GameStats
	ep_list: GameStatsList
	old_ep: OldGameStats
	chapRwdList: { bid: number, rwdStat: number }[]
	dress: unknown
	pvb2: { next: number, label: string }
	efunUpData: {	chongxing: number, xunfang: number, zhengwu: number, shangci: number }
	selectOfficials: []
	changjing: { ver: number, set: number, list: {id: number, cd: unknown, get: number}[] }
	fuserStatus: { status: number }
	vipStatus: { status: number }
	banben: { vipver: number }
}

export interface Item {
	id: number
	count: number
}
export interface Ranking {
	shili: number
	guanka: number
	love: number
	shiliKua: number
	clubKua: number
	heroKua: number
	loveKua: number
}
interface ClubMember {
	id: number
	name: string
	post: number
	sex: Sex
	job: string
	shili: number
	level: number
	gx: number
	allGx: number
	chenghao: number
	headType: number
	headId: number
	vipStatus: number
	vip: number
	jianshe: number
	loginTime: number
	inTime: { next: number, label: string }
}
export interface Club {
	memberInfo: {
		cid: number
		allgx: number
		leftgx: number
		dcid: number
		post: number
		ltime: { next: number, label: string }
	}
	clubInfo: {
		id: number
		name: string
		level: number
		exp: number
		fund: number
		qq: number
		laoma: string
		outmsg: string
		notice: string
		members: ClubMember[]
		isJoin: string
		mzUID: number
		icon: string
		goldLimit: number
		money: number
		userShili: number
		userLevel: number
		password: number
		clubLog: []
		bossinfo: []
	}
}
interface Task {
	id: number
	num: number
	max: number
}
interface Hanlin {
	level: number
	exp: number
	ruid: string
	ctime: number
	tip: number
}

interface WifeSkill {
	id: number
	level: number
	exp: number
}
export interface Wife {
	id: number
	love: number
	flower: number
	exp: number
	skill: WifeSkill[]
}
interface Spouse {
	fuid: number
	fname: string
	sname:  string
	sonuid: number
	honor: number
	sex: Sex
	ep: GameStats
}
export interface Son {
	id: number
	name: string
	sex: Sex
	mom: number
	state: number
	ep: GameStats
	talent: number
	cpoto: number
	level: number
	exp: number
	power: number
	cd: { next: number, label: string }
	honor: number
	tquid: number
	tqitem: number
	tqcd: { next: number, label: string }
	sptime: number
	spouse: Spouse
	myqjadd: number
	fqjadd: number
	isxingqin: number
	tc: number
}

export type GameInfos = {
	user: User
	hero: { heroList: Hero[] }
	item: { itemList: Item[] }
	wife: { wifeList: Wife[] }
	son: { sonList: Son[] }
	czlbhuodong: unknown //packs
	order: unknown
	fuli: unknown
	hangUpSystem: unknown //Kingdom
	weeklyrank: unknown
	yamen: unknown
	warHorse: unknown
	jingYing: unknown
	school: unknown
	ranking: { mobai: Ranking }
	huanggong: unknown
	laofang: unknown
	chenghao: unknown
	xunfang: unknown
	wordboss: unknown
	club: Club
	mail: unknown
	daily: unknown
	weekly: unknown
	dadian: unknown
	chengjiu: unknown
	task: { tmain: Task }
	hanlin: { info: Hanlin }
	friends: unknown
	huodonglist: unknown
	derail: unknown
	chat: unknown
	banish: unknown
	sevenSign: unknown
	czhuodong: unknown
	xingqin: unknown
	shop: unknown
	loginMod: unknown
	system: unknown
}
