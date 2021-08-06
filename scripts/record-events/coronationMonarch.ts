import { CoronationStatus, goat, PeoplesMonarchStatus } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'

const logEvent = async (name: string, event: CoronationStatus | PeoplesMonarchStatus): Promise<void> => {
	const [eid] = await client('events')
		.insert({
			name: 'Coronation',
			eid: event.cfg.info.no,
			start: fromUnixTime(event.cfg.info.sTime),
			end: fromUnixTime(event.cfg.info.eTime),
			type: event.cfg.info.type,
		})
		.returning('id')

	for (const item of event.exchange.list) {
		await client('event_shops').insert({
			event: eid,
			item: item.items.id,
			limit: item.totalLimit,
			count: item.items.count,
			price: item.need,
		})
	}
}

export const logCoronation = async (): Promise<void> => {
	const event = await goat.events.coronation.eventInfos()
	await logEvent('Coronation', event)
}
export const logPeoplesMonarch = async (): Promise<void> => {
	const event = await goat.events.peoplesMonarch.eventInfos()
	await logEvent('People\'s Monarch', event)
}
