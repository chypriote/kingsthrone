import { Item } from '../../goatGeneric'

type SurpriseEggShop = {
	id: number
	is_limit: number
	limit: number
	need_score: number
	vip: number
	item: Item[]
}

export type SurpriseEgg = {
	cfg: {
		buy: Item
		colorDrop: Item[]
		exchange: Item
		goldDrop: Item[]
		image: Item
		ironToGold: number
		phasesRewards: {
			id: number
			num: number
			rewards: Item[]
		}[]
		rank: {
			member: {count: number, id: number}[]
			rand: {re: number, rs: number}
		}[]
		score: number
		shop: SurpriseEggShop[]
	}
}
