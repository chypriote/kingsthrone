import { goat } from 'kingsthrone-api'
import { fromUnixTime } from 'date-fns'
import { client } from '../services/database'
import { logAllianceRewards, logChallengeRewards } from '../record-challenges'

export const logSparksUnderMoonlight = async (): Promise<void> => {
	const event = await goat.events.sparksUnderMoonlight.eventInfos()

	const [eid] = await client('events')
		.insert({
			name: 'Sparks Under the Moonlight',
			eid: 1251,
			start: fromUnixTime(1628812800),
			end: fromUnixTime(1629071999),
			type: 1250,
		})
		.returning('id')

	//log point exchanges
	for (const item of event.cfg.wall_shop) {
		await client('event_shops').insert({
			event: eid,
			item: item.item.id,
			limit: item.limit,
			count: item.item.count,
			price: item.need_score,
		})
	}

	//log drop from giving gifts
	for (const use of event.cfg.wall_consume) {
		for (const items of use.rand) {
			await client('event_drops').insert({
				event: eid,
				item: items.id,
				count: items.count,
				probability: items.pro,
			})
		}
	}

	//log individual ranking rewards
	const [cid] = await client('challenges')
		.insert({
			name: 'Sparks Under the Moonlight - Individual',
			cid: 1251,
			type: 1250,
			start: fromUnixTime(1628812800),
			end: fromUnixTime(1629071999),
			alliance: false,
			title: 'Emperor of Passion',
		})
		.returning('id')
	await logChallengeRewards(cid, event.cfg.wall_personal_rank)
	//Log alliance ranking rewards
	const [caid] = await client('challenges')
		.insert({
			name: 'Sparks Under the Moonlight - Alliance',
			cid: 1251,
			type: 1250,
			start: fromUnixTime(1628812800),
			end: fromUnixTime(1629071999),
			alliance: false,
			title: '',
		})
		.returning('id')
	await logAllianceRewards(caid, event.cfg.wall_alliance_rank)
}

