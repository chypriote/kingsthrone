import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logGiftOfTheFae = async (): Promise<void> => {
	const event = await goat.events.giftOfTheFae.eventInfos()
	const [eid] = await client('events')
		.insert({
			name: 'Gift of the Fae',
			eid: 1299,
			type: 1299,
			start: fromUnixTime(1627084800),
			end: fromUnixTime(11),
		})
		.returning('id')

	for (const item of event.shopCfg) {
		await client('event_shops').insert({
			event: eid,
			item: item.item.id,
			limit: item.limit,
			count: item.item.count,
			price: item.need_score,
		})
	}
	for (const item of event.cfg.DiamondsCompose.item) {
		await client('event_drops').insert({
			event: eid,
			item: item.id,
			count: item.count,
			probability: item.pro,
		})
	}
	for (const item of event.cfg.freeCompose.item) {
		await client('event_drops').insert({
			event: eid,
			item: item.id,
			count: item.count,
			probability: 100,
		})
	}
}
