import { EventPass, goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

const logPassItems = async (eid: number, event: EventPass): Promise<void> => {
	for (const item of event.shop.wsShopcfg) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.limitNum,
			count: item.items.count,
			price: item.need,
		})
	}
}
export const logKingsPass = async (): Promise<void> => {
	const event = await goat.events.kingsPass.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'King\'s Pass',
			eid: 1086,
			type: 1086,
			start: fromUnixTime(1625788800),
			end: fromUnixTime(11),
		})
		.returning('id')

	await logPassItems(eid, event)
}
export const logVenetianPass = async (): Promise<void> => {
	const event = await goat.events.venetianPass.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Venetian Pass',
			eid: 1241,
			type: 1231,
			start: fromUnixTime(1627257600),
			end: fromUnixTime(11),
		})
		.returning('id')

	await logPassItems(eid, event)
}
