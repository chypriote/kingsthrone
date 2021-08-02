import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logDragonSlaying = async (): Promise<void> => {
	const event = await goat.events.dragonSlaying.eventInfos()

	const [eid] = await client('events')
		.insert({
			eid: event.cfg.info.no,
			name: 'Dragon Slaying',
			start: fromUnixTime(event.cfg.info.sTime),
			type: event.cfg.info.type,
		})
		.returning('id')

	for (const list of event.cfg.boss_rwd) {
		for (const items of list.list) {
			const item = items.items
			await client('event_drops').insert({
				event: eid,
				item: item.id,
				count: item.count,
				probability: item.prob,
			})
		}
	}

	for (const item of event.exchange.list) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.limit,
			count: item.items.count,
			price: item.need,
		})
	}
}
