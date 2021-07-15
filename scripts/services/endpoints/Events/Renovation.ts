import { GoatResource } from '../../GoatResource'
import { find } from 'lodash'
import { Item } from '../../../../types/goat/Item'

export class Renovation extends GoatResource {
	async findEgg(): Promise<number> {
		const data = await this.request({ 'user': { 'inner_egg': [] }, 'rsn': '1ktukkqqkuu' })
		const egg = find(data.a.user.inner_egg, (item: Item) => item.id === 1)
		if (!egg) {
			throw new Error('No gems found')
		}

		return egg.count
	}

	async claimEgg(): Promise<void> {
		await this.request({ 'user': { 'inner_rwd': [] }, 'rsn': '1ktukkqiewk' })
	}
}
