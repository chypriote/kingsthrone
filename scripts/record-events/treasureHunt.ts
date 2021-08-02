import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logTreasureHunt = async (): Promise<void> => {
	const event = await goat.events.treasureHunt.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Treasure Hunt',
		eid: event.cfg.info.id,
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	}).returning('id')

	for (const item of event.cfg.suiji) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.id,
				count: item.count,
				probability: item.prob10000,
			})
	}
}
