/* eslint-disable @typescript-eslint/no-unused-vars */
import { find } from 'lodash'
import { fromUnixTime, startOfToday } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { client } from './services/database'
import { logger } from './services/logger'
import { EventWheel, PathOfWealthStatus } from 'kingsthrone-api/lib/types/Events'

const logItemWheel = async (event: EventWheel, event_db_id: number) => {
	for (const item of event.cfg.wall_gache) {
		if (Array.isArray(item.default_item)) {
			const current = event.info.chosen.find((it: { id: number, key: number }) => it.id === item.id)
			if (!current) {logger.error('you need to choose a reward first'); return}
			const chosen = find(event.cfg.chosen_pool, e => e.key === current.key)
			if (!chosen) {logger.error('chosen item not found'); return}
			item.default_item = chosen.item
		}
		await client('event_drops')
			.insert({
				event: event_db_id,
				item: item.default_item.id,
				count: item.default_item.count,
				probability: item.prob_1000,
			})
	}
}
const logGardenStroll = async () => {
	const event = await goat.events.gardenStroll.eventInfos()

	const [eid] = await client('events').insert({
		eid: event.cfg.info.id,
		name: 'Garden Stroll',
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	}).returning('id')

	for (const item of event.cfg.drop) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.items.id,
				probability: item.prob_10000,
				count: item.items.count,
			})
	}
	const shop = await goat.events.gardenStroll.getShop()
	for (const item of shop.cfg.shop.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.totalLimit,
				count: item.items.count,
				price: item.need,
			})
	}
}
const logDarkCastle = async () => {
	const event = await goat.events.darkCastle.eventInfos()

	const [eid] = await client('events').insert({
		eid: event.wsInfo.info.id,
		name: 'Dark Castle',
		start: fromUnixTime(event.wsInfo.info.sTime),
		type: event.wsInfo.info.type,
	})

	for (const item of event.wsInfo.gezi.list) {
		if (!item.items.id) { continue }
		await client('event_drops')
			.insert({
				event: eid,
				item: item.items.id,
				count: item.items.count,
			})
	}

	for (const item of event.wsShop.wsShopcfg) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.limitNum,
				count: item.items.count,
				price: item.need,
			})
	}
}
const logDragonSlaying = async () => {
	const event = await goat.events.dragonSlaying.eventInfos()

	const [eid] = await client('events').insert({
		eid: event.cfg.info.no,
		name: 'Dragon Slaying',
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	}).returning('id')

	for (const list of event.cfg.boss_rwd) {
		for (const items of list.list) {
			const item = items.items
			await client('event_drops')
				.insert({
					event: eid,
					item: item.id,
					count: item.count,
					probability: item.prob,
				})
		}
	}

	for (const item of event.exchange.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.limit,
				count: item.items.count,
				price: item.need,
			})
	}
}
const logJewelsOfLuck = async () => {
	const event = await goat.events.jewelsOfLuck.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Jewels of Luck',
		eid: 208,
		start: fromUnixTime(1626393600),
		type: 2,
	}).returning('id')

	await logItemWheel(event, eid)
}
const logPicnic = async () => {
	const event = await goat.events.picnic.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Picnic',
		eid: 1028,
		start: fromUnixTime(1626652800),
		type: 1028,
	}).returning('id')

	for (const item of event.shop.wsShopcfg) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.limit,
				count: item.items.count,
				price: item.need,
			})
	}
	for (const item of event.info.list) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.items.id,
				count: item.items.count,
				probability: item.prob_10000,
			})
	}
}
const logTreasureHunt = async () => {
	const event = await goat.events.treasureHunt.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Treasure Hunt',
		eid: event.cfg.info.id,
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	}).returning('id')

	for (const item of event.cfg.suiji) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.id,
				count: item.count,
				probability: item.prob10000,
			})
	}
}
const logMaidenPainting = async () => {
	const event = await goat.events.maidenPainting.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Maiden Painting',
		eid: 1258,
		start: fromUnixTime(1626652800),
		type: 1258,
	}).returning('id')

	for (const item of event.shop.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.totalLimit,
				count: item.items.count,
				price: item.need,
			})
	}
	await logItemWheel(event.wheel, eid)
}
const logDivining = async () => {
	const event = await goat.events.divining.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Divining',
		eid: 1123,
		start: fromUnixTime(1626998400),
		type: 1123,
	}).returning('id')

	for (const item of event.cfg.rewards) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.id,
				count: item.count,
			})
	}
	for (const item of event.shop.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.all_limit,
				count: item.items.count,
				price: item.need,
			})
	}
}
const logCoronation = async () => {
	const event = await goat.events.coronation.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Coronation',
		eid: event.cfg.info.no,
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	}).returning('id')

	for (const item of event.exchange.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.totalLimit,
				count: item.items.count,
				price: item.need,
			})
	}
}
const logPeoplesMonarch = async () => {
	const event = await goat.events.peoplesMonarch.eventInfos()

	const [eid] = await client('events').insert({
		name: 'People\'s Monarch',
		eid: event.cfg.info.no,
		start: fromUnixTime(event.cfg.info.sTime),
		type: event.cfg.info.type,
	}).returning('id')

	for (const item of event.exchange.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.totalLimit,
				count: item.items.count,
				price: item.need,
			})
	}
}
const logDailyAllianceShop = async () => {
	const event = await goat.challenges.allianceSiege.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Alliance Siege Daily',
		eid: null,
		start: startOfToday(),
		type: 1096,
	}).returning('id')

	for (const item of event.cfg.day_wall_shop) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.item.id,
				limit: item.limit,
				count: item.item.count,
				price: item.need_score,
			})
	}
}
const logAllianceSiege = async () => {
	const event = await goat.challenges.allianceSiege.eventInfos()

	const [eid] = await client('events').insert({
		name: 'Alliance Siege Shop',
		eid: 1095,
		start: fromUnixTime(1626393600),
		type: 1095,
	}).returning('id')

	for (const item of event.cfg.wall_shop) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.item.id,
				limit: item.limit,
				count: item.item.count,
				price: item.need_score,
			})
	}
}
const logBlessedChest = async () => {
	const event = await goat.events.blessedChest.eventInfos()
	const [eid] = await client('events').insert({
		name: 'Blessed Chest',
		eid: 1276,
		type: 1276,
		start: fromUnixTime(1626652800),
	}).returning('id')

	for (const item of event.cfg.shop) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.item.id,
				limit: item.limit,
				count: item.item.count,
				price: item.need_score,
			})
	}
}
const logGiftOfTheFae = async () => {
	const event = await goat.events.giftOfTheFae.eventInfos()
	const [eid] = await client('events').insert({
		name: 'Gift of the Fae',
		eid: 1299,
		type: 1299,
		start: fromUnixTime(1627084800),
	}).returning('id')

	for (const item of event.shopCfg) {
		await client('event_shops').insert({
			event: eid,
			item: item.item.id,
			limit: item.limit,
			count: item.item.count,
			price: item.need_score,
		})
	}
	for (const item of event.cfg.DiamondsCompose.item) {
		await client('event_drops').insert({
			event: eid,
			item: item.id,
			count: item.count,
			probability: item.pro,
		})
	}
	for (const item of event.cfg.freeCompose.item) {
		await client('event_drops').insert({
			event: eid,
			item: item.id,
			count: item.count,
			probability: 100,
		})
	}
}
const logPathOfWealth = async () => {
	const event: PathOfWealthStatus = await goat.events.pathOfWealth.eventInfos()

	const [eid] = await client('events').insert({
		eid: event.xunbao.cfg.info.id,
		name: 'Path of Wealth',
		start: fromUnixTime(event.xunbao.cfg.info.sTime),
		type: event.xunbao.cfg.info.type,
	}).returning('id')

	for (const item of event.xunbao.cfg.gezi.list) {
		if (!item.items.id) { continue }
		await client('event_drops')
			.insert({
				event: eid,
				item: item.items.id,
				count: item.items.count,
			})
	}
	for (const chest of event.xunbao.cfg.rwd) {
		for (const item of chest.items) {
			await client('event_drops')
				.insert({
					event: eid,
					item: item.id,
					count: item.count,
				})
		}
	}
}

const logRenownedMerchant = async () => {
	const event = await goat.events.renownedMerchant.eventInfos()
	const [eid] = await client('events').insert({
		name: 'Renowned Merchant',
		eid: 1247,
		start: fromUnixTime(1627257600),
		type: 1231,
	}).returning('id')

	for (const item of event.renownedMerchant.shop.list) {
		await client('event_shops')
			.insert({
				event: eid,
				item: item.items.id,
				limit: item.all_limit,
				count: item.items.count,
				price: item.need,
			})
	}
	for (const item of event.renownedMerchant.cfg.list) {
		await client('event_drops')
			.insert({
				event: eid,
				item: item.items.id,
				probability: item.prob_10000,
				count: item.items.count,
			})
	}
}

const logEvents = async () => {
	await logDragonSlaying()
	await logPeoplesMonarch()
	await logDailyAllianceShop()
}
logEvents().then(() => { process.exit()})
