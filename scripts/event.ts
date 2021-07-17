import { find } from 'lodash'
import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { client } from './services/database'
import { Event } from '../types/strapi/Event'

export const getEventByEID = async (eid: number): Promise<Event> => {
	const events = await client('events')
		.where('eid', '=', eid)
		.limit(1)

	return events.length ? events[0] : null
}

const logGardenStroll = async () => {
	const event = await goat.events.gardenStroll.eventInfos()

	await client('events').insert({
		eid: event.cfg.info.id,
		name: 'Garden Stroll',
		start: fromUnixTime(event.cfg.info.sTime),
	})
	const created = await getEventByEID(event.cfg.info.id)

	for (const item of event.cfg.drop) {
		await client('event_drops')
			.insert({
				event: created.id,
				item: item.items.id,
				probability: item.prob_10000,
				count: item.items.count,
			})
	}
	const shop = await goat.events.gardenStroll.getShop()
	for (const item of shop.cfg.shop.list) {
		await client('event_shops')
			.insert({
				event: created.id,
				item: item.items.id,
				limit: item.totalLimit,
				count: item.items.count,
				price: item.need,
			})
	}
}

const logDarkCastle = async () => {
	const event = await goat.events.darkCastle.eventInfos()

	await client('events').insert({
		eid: event.wsInfo.info.id,
		name: 'Dark Castle',
		start: fromUnixTime(event.wsInfo.info.sTime),
	})
	const created = await getEventByEID(event.wsInfo.info.id)

	for (const item of event.wsInfo.gezi.list) {
		if (!item.items.id) { continue }
		await client('event_drops')
			.insert({
				event: created.id,
				item: item.items.id,
				count: item.items.count,
			})
	}

	for (const item of event.wsShop.wsShopcfg) {
		await client('event_shops')
			.insert({
				event: created.id,
				item: item.items.id,
				limit: item.limitNum,
				count: item.items.count,
				price: item.need,
			})
	}
}

const logDragonSlaying = async () => {
	const event = await goat.events.dragonSlaying.eventInfos()

	await client('events').insert({
		eid: event.cfg.info.no,
		name: 'Dragon Slaying',
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	})
	const created = await getEventByEID(event.cfg.info.no)

	for (const list of event.cfg.boss_rwd) {
		for (const items of list.list) {
			const item = items.items
			await client('event_drops')
				.insert({
					event: created.id,
					item: item.id,
					count: item.count,
					probability: item.prob,
				})
		}
	}

	for (const item of event.exchange.list) {
		await client('event_shops')
			.insert({
				event: created.id,
				item: item.items.id,
				limit: item.limit,
				count: item.items.count,
				price: item.need,
			})
	}
}

const logJewelsOfLuck = async () => {
	const event = await goat.events.jewelsOfLuck.eventInfos()

	await client('events').insert({
		name: 'Jewels of Luck',
		eid: 208,
		start: fromUnixTime(1626393600),
		type: 2,
	})
	const created = await getEventByEID(208)

	for (const item of event.cfg.wall_gache) {
		if (Array.isArray(item.default_item)) {
			const current = event.info.chosen.find((it: { id: number, key: number }) => it.id === item.id)
			if (!current) {console.log('you need to choose a reward first'); return}
			const chosen = find(event.cfg.chosen_pool, e => e.key === current.key)
			if (!chosen) {console.log('chosen item not found'); return}
			item.default_item = chosen.item
		}
		await client('event_drops')
			.insert({
				event: created.id,
				item: item.default_item.id,
				count: item.default_item.count,
				probability: item.prob_1000,
			})
	}
}

const logEvents = async () => {
	await logGardenStroll()
	await logDarkCastle()
	await logDragonSlaying()
	await logJewelsOfLuck()
}
logEvents().then(() => { process.exit()})
