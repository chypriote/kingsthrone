import { find } from 'lodash'
import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { EventWheel } from 'kingsthrone-api/lib/types/Events'

export const logItemWheel = async (event: EventWheel, event_db_id: number): Promise<void> => {
	for (const item of event.cfg.wall_gache) {
		if (Array.isArray(item.default_item)) {
			const current = event.info.chosen.find((it: { id: number; key: number }) => it.id === item.id)
			if (!current) {
				logger.error('you need to choose a reward first')
				return
			}
			const chosen = find(event.cfg.chosen_pool, (e) => e.key === current.key)
			if (!chosen) {
				logger.error('chosen item not found')
				return
			}
			item.default_item = chosen.item
		}
		await client('event_drops').insert({
			event: event_db_id,
			item: item.default_item.id,
			count: item.default_item.count,
			probability: item.prob_1000,
		})
	}
}

export const logJewelsOfLuck = async (): Promise<void> => {
	const event = await goat.events.jewelsOfLuck.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Jewels of Luck',
			eid: 208,
			start: fromUnixTime(1626393600),
			end: fromUnixTime(11),
			type: 2,
		})
		.returning('id')

	await logItemWheel(event, eid)
}
