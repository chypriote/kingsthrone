import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { DIY_PACKS } from 'kingsthrone-api/lib/types/Events/DIYStore'
import { client } from '../services/database'

const getName = (pack: DIY_PACKS): string => {
	switch (pack) {
	case DIY_PACKS.FREE_PACK: return 'DIY Store Free'
	case DIY_PACKS.ONE$_PACK: return 'DIY Store 0.99$'
	case DIY_PACKS.TEN$_PACK: return 'DIY Store 9.99$'
	case DIY_PACKS.THIRTY$_PACK: return 'DIY Store 29.99$'
	case DIY_PACKS.FIFTY$_PACK: return 'DIY Store 49.99$'
	case DIY_PACKS.HUNDRED$_PACK: return 'DIY Store 99.99$'
	default: return 'DIY Store - Unknown'
	}
}

export const logDIYStore = async (): Promise<void> => {
	const event = await goat.events.diyStore.eventInfos()

	for (const pack of event.cfg) {
		const [eid] = await client('events').insert({
			name: getName(pack.dc),
			eid: 1156,
			type: 1156,
			start: fromUnixTime(1627905900),
		}).returning('id')

		for (const item of pack.fixedRwd) {
			await client('event_shops').insert({
				event: eid,
				item: item.id,
				limit: pack.limit,
				count: item.count,
				price: 0,
			})
		}
		for (const pos of pack.optionRwd) {
			for (const item of pos.rwd) {
				await client('event_shops').insert({
					event: eid,
					item: item.id,
					limit: 1,
					count: item.count,
					price: 0,
				})
			}
		}
	}
}
