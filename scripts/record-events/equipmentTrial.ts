import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'
import { logItemWheel } from './itemWheel'

export const logEquipmentTrial = async (): Promise<void> => {
	const event = await goat.events.equipmentTrial.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Equipment Trial',
			eid: 1332,
			start: fromUnixTime(1628208000),
			end: fromUnixTime(11),
			type: 1332,
		})
		.returning('id')

	for (const item of event.event.shop.list) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.all_limit,
			count: item.items.count,
			price: item.need,
		})
	}

	const [wid] = await client('events')
		.insert({
			name: 'Equipment Trial - Item Wheel',
			eid: 1334,
			start: fromUnixTime(1628208000),
			end: fromUnixTime(11),
			type: 1332,
		})
		.returning('id')
	await logItemWheel(event.wheel, wid)
}
