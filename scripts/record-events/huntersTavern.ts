import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { client } from '../services/database'

export const logHuntersTavern = async (): Promise<void> => {
	const event = await goat.events.huntersTavern.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Hunter\'s Tavern',
			eid: 1091,
			start: fromUnixTime(1628208000),
			end: fromUnixTime(11),
			type: 1089,
		})
		.returning('id')

	for (const item of event.cfg.rewards) {
		await client('event_drops').insert({
			event: eid,
			item: item.rwd.id,
			count: item.rwd.count,
		})
	}
	for (const item of event.cfg.chosen_pool) {
		await client('event_drops').insert({
			event: eid,
			item: item.rwd.id,
			count: item.rwd.count,
		})
	}
}
