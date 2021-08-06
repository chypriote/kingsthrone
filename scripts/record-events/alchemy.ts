import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'
import { EventDropWithProbability } from 'kingsthrone-api/lib/types/Events'

const logAlchemyDrop = async (items: EventDropWithProbability[], name: string): Promise<void> => {
	const [eid] = await client('events')
		.insert({
			name: name,
			eid: null,
			type: 1092,
			start: fromUnixTime(1627603200),
			end: fromUnixTime(1),
		})
		.returning('id')
	for (const item of items) {
		await client('event_drops').insert({
			event: eid,
			item: item.items.id,
			probability: item.prob_10000,
			count: item.items.count,
		})
	}
}
export const logAlchemy = async (): Promise<void> => {
	const event = await goat.events.alchemy.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Alchemy',
			eid: 1092,
			type: 1092,
			start: fromUnixTime(1627603200),
		})
		.returning('id')

	for (const item of event.shop.wsShopcfg) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.limitNum,
			count: item.items.count,
			price: item.need,
		})
	}

	await Promise.all([
		logAlchemyDrop(event.cfg.milkCfg, 'Alchemy - Trade Iron'),
		logAlchemyDrop(event.cfg.biscuitsCfg, 'Alchemy - Trade Bottles'),
		logAlchemyDrop([...event.cfg.coalCfg.randRewards, ...event.cfg.coalCfg.fixedReward], 'Alchemy - Trade Ores'),
	])

	const [rid] = await client('events')
		.insert({
			name: 'Alchemy - Complete rewards',
			eid: null,
			type: 1092,
			start: fromUnixTime(1627603200),
		})
		.returning('id')

	for (const items of event.cfg.completeRwd) {
		for (const item of items.items) {
			await client('event_drops').insert({
				event: rid,
				item: item.id,
				count: item.count,
			})
		}
	}
}
