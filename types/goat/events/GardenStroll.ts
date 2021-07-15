import { Item } from '~/types/goat/Item'
import { EventShopRank } from '~/types/goat/events/Event'

export interface GardenStrollDrop { //Possible drops
	id: number
	tip: number
	items: Item
	prob_10000: number //probability
	is_baoji: number
	add: number
}

export interface GardenStrollChest {
	id: number
	jifen: number //steps required
	items: Item[]
	isGet: number //2=yes 0=no
}

interface GardenStrollInfo {
	info: {
		id: number
		title: string
		pindex: number
		type: number
		sTime: number
		eTime: number
		showTime: number
		_act_id: string
	}
	drop: GardenStrollDrop[]
	baoxiang: GardenStrollChest[]
	rank: EventShopRank[]
	msg: string
	is_kua: number
	set: {
		price: number
		ten: number
		score: number
		min: number
		juli: number
		up_10000: number
	}
}

export interface GardenStroll {
	cfg: GardenStrollInfo
	bu: number
	cons: number
	leftcons: number
	quan: number
	free: number
}

interface GardenStrollExchange {
	id: number
	is_limit: number
	items: Item
	limit: number //items left
	need: number //points cost
	totalLimit: number //max buyable
}
export interface GardenStrollPointExchange {
	cfg: { shop: { list: GardenStrollExchange[] }}
	leftcons: number //points left
}
