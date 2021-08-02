import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

export const logGiftingTree = async (): Promise<void> => {
	const event = await goat.events.giftingTree.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Gifting Tree',
		eid: 1085,
		type: 1083,
		start: fromUnixTime(1627603200),
	}).returning('id')

	for (const item of event.cfg.rewards) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.rwd.id,
				count: item.rwd.count,
			})
	}
	for (const item of event.cfg.chosen_pool) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.rwd.id,
				count: item.rwd.count,
			})
	}
}
