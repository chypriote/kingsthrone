export interface Shop {
	id: number
	shop_id: number
	name: string
	vip: number
	price: number
	limit: number
	from: Date
	to: Date
	items: any[]
}
