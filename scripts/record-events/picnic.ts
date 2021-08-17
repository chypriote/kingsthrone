import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logPicnic = async (): Promise<void> => {
	const event = await goat.events.picnic.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Picnic',
			eid: 1028,
			start: fromUnixTime(1629072000),
			end: fromUnixTime(1629417600),
			type: 1028,
		})
		.returning('id')

	for (const item of event.shop.wsShopcfg) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.limit,
			count: item.items.count,
			price: item.need,
		})
	}
	for (const item of event.info.list) {
		await client('event_drops').insert({
			event: eid,
			item: item.items.id,
			count: item.items.count,
			probability: item.prob_10000,
		})
	}
}
