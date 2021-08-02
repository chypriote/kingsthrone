import { goat } from 'kingsthrone-api'
import { fromUnixTime, startOfToday } from 'date-fns'
import { client } from '../services/database'

export const logDailyAllianceShop = async (): Promise<void> => {
	const event = await goat.challenges.allianceSiege.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Alliance Siege Daily',
			eid: null,
			start: startOfToday(),
			type: 1096,
		})
		.returning('id')

	for (const item of event.cfg.day_wall_shop) {
		await client('event_shops').insert({
			event: eid,
			item: item.item.id,
			limit: item.limit,
			count: item.item.count,
			price: item.need_score,
		})
	}
}
export const logAllianceSiege = async (): Promise<void> => {
	const event = await goat.challenges.allianceSiege.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Alliance Siege Shop',
			eid: 1095,
			start: fromUnixTime(1626393600),
			type: 1095,
		})
		.returning('id')

	for (const item of event.cfg.wall_shop) {
		await client('event_shops').insert({
			event: eid,
			item: item.item.id,
			limit: item.limit,
			count: item.item.count,
			price: item.need_score,
		})
	}
}
