import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logBlessedChest = async (): Promise<void> => {
	const event = await goat.events.blessedChest.eventInfos()
	const [eid] = await client('events')
		.insert({
			name: 'Blessed Chest',
			eid: 1276,
			type: 1276,
			start: fromUnixTime(1626652800),
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
