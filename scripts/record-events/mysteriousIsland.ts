import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { client } from '../services/database'

export const logMysteriousIsland = async (): Promise<void> => {
	const event = await goat.events.mysteriousIsland.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Mysterious Island',
			eid: 1089,
			start: fromUnixTime(1628208000),
			end: fromUnixTime(11),
			type: 1089,
		})
		.returning('id')

	for (const item of event.cfg.shop) {
		await client('event_shops').insert({
			event: eid,
			item: item.item.id,
			limit: item.limit,
			count: item.item.count,
			price: item.need_score,
		})
	}
}
