import { Item } from '../../goatGeneric'

type AstrologyShop = {
	hasScore: number
	list: {
		all_limit: number
		id: number
		is_limit: number
		items: Item[]
		limit: number
		need: number
	}[]
}

export type Astrology = {
	info: {
		boxRwdStatus: number
		hdItem: number
		luckyStar: {id: number}[]
		starscore: number
		starSign: number
		surplusFreeNum: number
	}
	shop: AstrologyShop
	cfg: {
		gxitemCost: number
		gxscore: number
		itemCost: number
		luckyStarList: {id:number, name: string}[]
		rankRwd: {
			member: {count: number, id: number}[]
			rand: {re: number, rs:number}
		}[]
		rewards: Item[]
		starSignList: {id: number, name: string}[]
		updateSelect: number
	}
}
