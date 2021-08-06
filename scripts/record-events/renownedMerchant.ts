import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logRenownedMerchant = async (): Promise<void> => {
	const event = await goat.events.renownedMerchant.eventInfos()
	const [eid] = await client('events')
		.insert({
			name: 'Renowned Merchant',
			eid: 1247,
			start: fromUnixTime(1627257600),
			end: fromUnixTime(11),
			type: 1231,
		})
		.returning('id')

	for (const item of event.renownedMerchant.shop.list) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.all_limit,
			count: item.items.count,
			price: item.need,
		})
	}
	for (const item of event.renownedMerchant.cfg.list) {
		await client('event_drops').insert({
			event: eid,
			item: item.items.id,
			probability: item.prob_10000,
			count: item.items.count,
		})
	}
}
