import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logDarkCastle = async (): Promise<void> => {
	const event = await goat.events.darkCastle.eventInfos()

	const [eid] = await client('events').insert({
		eid: event.wsInfo.info.id,
		name: 'Dark Castle',
		start: fromUnixTime(event.wsInfo.info.sTime),
		type: event.wsInfo.info.type,
	})

	for (const item of event.wsInfo.gezi.list) {
		if (!item.items.id) { continue }
		await client('event_drops')
			.insert({
				event: eid,
				item: item.items.id,
				count: item.items.count,
			})
	}

	for (const item of event.wsShop.wsShopcfg) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.limitNum,
				count: item.items.count,
				price: item.need,
			})
	}
}
