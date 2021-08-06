import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logGardenStroll = async (): Promise<void> => {
	const event = await goat.events.gardenStroll.eventInfos()

	const [eid] = await client('events')
		.insert({
			eid: event.cfg.info.id,
			name: 'Garden Stroll',
			start: fromUnixTime(event.cfg.info.sTime),
			end: fromUnixTime(event.cfg.info.eTime),
			type: event.cfg.info.type,
		})
		.returning('id')

	for (const item of event.cfg.drop) {
		await client('event_drops').insert({
			event: eid,
			item: item.items.id,
			probability: item.prob_10000,
			count: item.items.count,
		})
	}
	const shop = await goat.events.gardenStroll.getShop()
	for (const item of shop.cfg.shop.list) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.totalLimit,
			count: item.items.count,
			price: item.need,
		})
	}
}
