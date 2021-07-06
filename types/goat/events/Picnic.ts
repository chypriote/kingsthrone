import { Item } from '~/types/goatGeneric'

type PicnicShopItem = {
	dc: number
	hasLimitNum: number
	items: Item[]
	limit: number
	limitNum: number
	need: number
}
type PicnicShop = {
	hasScore: number
	rank: {
		member: {count: number, id: number}[]
		rand: {re: number, rs: number}
	}
	wsShopcfg: PicnicShopItem[]
}
type PicnicQuest = {
	id: number
	num: number
	rwd: number
}

export type Picnic = {
	info: {
		cons: number
		quan: number
		quanBuyNeed: number
		quandNeedTen: number
		score: number
		image: Item[]
		list: {
			dc: number
			items: Item[]
			prob_10000: number
			tip: number
		}
	}
	shop: PicnicShop
	task: {
		tasks: PicnicQuest[]
		taskscfg: {
			type: number
			dcCfg: {
				id: number
				max: number
				items: Item[]
			}
		}
	}
}
