import { Hero } from '~/scripts/repository/roster'
import { TourneyInfos } from '~/types/tourney'
import { CastleInfos } from '~/types/goat/Kingdom'
import { RegularTasks } from '~/types/goat/RegularTasks'
import { Club } from '~/types/goat/Club'

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
	available: boolean
}

interface SpecialOfferPack {
	dc: number
	items: Item[]
	itemText: string
	showHero: {id: number, type: number}
}
interface ShopPack {
	alreadybuy: number //packs bought
	biaohao: string //name
	bid: number
	diamond: number //gems
	discout: number //shown % discount
	id: number //pack id
	items: Item[]
	limit: number //max packs
	name: string //name
	need: number //price
	tips: string //
	type: number
	vipexp: number //exp won
}
interface ShopPackTip {
	description: string
	item: Item
	type: number
}
interface PurchaseReward {
	info: {
		_act_id: number
		eTime: number //end time
		id: number
		pindex: number
		showTime: number
		sTime: number //start time
		title: string //name
		type: number
		ycdc: number
	}
	msg: string
	rwd: {id: number, items: Item[], need: number /*vipexp needed*/}
}

export type GameInfos = {
	banish: { heroList: unknown }
	chat: {  blacklist: unknown }
	chenghao: {
		chInfo: {setid: number, list: {checked: number, chid: number, endT: number, getT: number}[]}
		wyrwd: {get: number}
	}
	chengjiu: { cjlist: {id: number, num: number, rwd: number}[] }
	club: Club
	CombinedSevContinuous: {
		info: unknown
		cfg: SpecialOfferPack[]
	}
	czhuodong: {
		day: { cfg: PurchaseReward, cons: number, rwd: number }
		leitian: { cfg: PurchaseReward, cons: number, rwd: number }
		total: { cfg: PurchaseReward, cons: number, rwd: number }
	}
	czlbhuodong: {
		list: ShopPack[] //recommended
		listTwo: ShopPack[] //special
		typeInfo: ShopPackTip[]
		typeInfoTwo: ShopPackTip[]
	}
	dadian: { counter: {id: number, name: string, num: number}[] } //main quest status
	daily: RegularTasks
	derail: unknown
	friends: unknown
	fuli: unknown
	hangUpSystem: { info: CastleInfos[] } //Kingdom
	hanlin: { info: Hanlin }
	hero: { heroList: Hero[] }
	huanggong: { qingAn: {type: number} }
	huodonglist: unknown
	item: { itemList: Item[] }
	jingYing: unknown
	laofang: unknown
	loginMod: unknown
	mail: unknown
	order: unknown
	ranking: { mobai: Ranking }
	school: unknown
	sevenSign: unknown
	shop: unknown
	son: { sonList: Son[] }
	system: unknown
	task: { tmain: Task }
	user: User
	warHorse: unknown
	weekly: RegularTasks
	weeklyrank: unknown
	wife: { wifeList: Wife[] }
	wordboss: unknown
	xingqin: unknown
	xunfang: unknown
	yamen: TourneyInfos //Tourney
}
