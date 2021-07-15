import { GoatResource } from '../GoatResource'
import { Item } from '../../../types/goat/Item'

export class Items extends GoatResource {
	async getBag(): Promise<Item[]> {
		const data = await this.request({ 'rsn': '3hkekekhzp', 'item': { 'itemlist': [] } })
		return data.a.item.itemList
	}

	async use(item: number, count: number): Promise<Item> {
		const data = await this.request({ 'rsn': '1tbkbkruwa', 'item': { 'useitem': { 'id': item, 'count': count } } })
		return data.u.item.itemList[0]
	}

	async combine(item: number, count: number): Promise<Item[]> {
		const data = await this.request({ 'rsn': '4cifiaahbv', 'item': { 'hecheng': { 'count': count, 'id': item } } })
		return data.u.item.itemList
	}
}
