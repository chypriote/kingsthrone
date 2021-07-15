import { Item } from './Item'

enum FEAST_TYPE {
	SMALL = 1,
	GREAT = 2,
}

export type Poisoner = {
	id: string
	name: string
	level: number
	shili: number
	ctime: number
}

export type PreviousFeast = {
	id: number
	score: number
	bad: number
	ctime: number
	num: number
	ep: number
}

export type OngoingFeast = {
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
	clubid: string
	clubname: string
	frame: number
	head: number
	chatframe: number
	rid: number
	num: number
}

export type ShopItem = {
	id: number
	item: Item,
	cost: number
	buy: number
	discount: number
}
export type FeastShop = {
	score: number
	ltime: {
		next: number
		label: string
	}
	list: ShopItem[]
}

export type FeastStatus = {
	fynum: number
	fymax: number //max feasts
	buyNum: number //feasts bought
	buffNum: number
	freeNum: number //available feasts
}

export type Feast = {
	uid: string
	name: string
	type: FEAST_TYPE
	num: number
	clubId: string
}

export type FeastInfo = {
	yhType: { type: number }
	jlfy: FeastStatus
	jlShopfresh: {
		fnum: number
		fmax: number
		fcost: number
	}
	jlShop: FeastShop
	yhshow: Feast[]
	yhbad: Poisoner[]
	yhOld: PreviousFeast[]
	lbList: OngoingFeast[]
}

export type Seat = {
	uid: string,
	type: number
	id: number
	clubId: string
	name: string
	job: number
	sex: number
	chenghao: number
	headType: number
	headId: number
}

export type FeastDetails = {
	id: number
	uid: string
	job: number
	sex: number
	level: number
	chenghao: number
	name: string
	score: number
	ltime: {
		next: number
		label: string
	},
	clubId: string
	headType: number
	headId: number
	num: number
	maxnum: number
	list: Seat[]
}
