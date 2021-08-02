import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logMaidenPainting = async (): Promise<void> => {
	const event = await goat.events.maidenPainting.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Maiden Painting',
		eid: 1258,
		start: fromUnixTime(1626652800),
		type: 1258,
	}).returning('id')

	for (const item of event.shop.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.totalLimit,
				count: item.items.count,
				price: item.need,
			})
	}
	await logItemWheel(event.wheel, eid)
}
