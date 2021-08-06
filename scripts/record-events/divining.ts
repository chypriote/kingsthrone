import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logDivining = async (): Promise<void> => {
	const event = await goat.events.divining.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Divining',
			eid: 1123,
			start: fromUnixTime(1628208000),
			end: fromUnixTime(11),
			type: 1123,
		})
		.returning('id')

	for (const item of event.cfg.rewards) {
		await client('event_drops').insert({
			event: eid,
			item: item.id,
			count: item.count,
		})
	}
	for (const item of event.shop.list) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.all_limit,
			count: item.items.count,
			price: item.need,
		})
	}
}
