import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { PRIZE_TYPE } from 'kingsthrone-api/lib/types/Events/ScratchAndWin'
import { client } from '../services/database'

const getName = (prize: PRIZE_TYPE): string => {
	switch (prize) {
	case PRIZE_TYPE.GRAND: return 'Grand Prize'
	case PRIZE_TYPE.FIRST: return 'First Prize'
	case PRIZE_TYPE.SECOND: return 'Second Prize'
	case PRIZE_TYPE.THIRD: return 'Third Prize'
	case PRIZE_TYPE.FOURTH: return 'Fourth Prize'
	default: return 'Unknown'
	}
}

export const logScratchAndWin = async (): Promise<void> => {
	const event = await goat.events.scratchAndWin.eventInfos()

	for (const prize of event.cfg.shop) {
		const [eid] = await client('events').insert({
			name: `Scratch and Win - ${getName(prize.type)}`,
			eid: 1341,
			type: 1341,
			start: fromUnixTime(1627862400),
			end: fromUnixTime(11),
		}).returning('id')

		for (const items of prize.cfg) {
			await client('event_shops').insert({
				event: eid,
				item: items.item.id,
				limit: items.limit,
				count: items.item.count,
				price: items.need_score,
			})
		}
	}
}
