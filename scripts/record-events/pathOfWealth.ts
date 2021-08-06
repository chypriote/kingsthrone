import { goat, PathOfWealthStatus } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logPathOfWealth = async (): Promise<void> => {
	const event: PathOfWealthStatus = await goat.events.pathOfWealth.eventInfos()

	const [eid] = await client('events')
		.insert({
			eid: event.xunbao.cfg.info.id,
			name: 'Path of Wealth',
			start: fromUnixTime(event.xunbao.cfg.info.sTime),
			end: fromUnixTime(event.xunbao.cfg.info.eTime),
			type: event.xunbao.cfg.info.type,
		})
		.returning('id')

	for (const item of event.xunbao.cfg.gezi.list) {
		if (!item.items.id) {
			continue
		}
		await client('event_drops').insert({
			event: eid,
			item: item.items.id,
			count: item.items.count,
		})
	}
	for (const chest of event.xunbao.cfg.rwd) {
		for (const item of chest.items) {
			await client('event_drops').insert({
				event: eid,
				item: item.id,
				count: item.count,
			})
		}
	}
}
