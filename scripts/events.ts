import { goat } from 'kingsthrone-api'
import { fromUnixTime, isFuture } from 'date-fns'
import { CORONATION_ITEM, GiftOfTheFaeStatus, QUEST_STATUS, RWD_STATUS } from 'kingsthrone-api/lib/types/Events'
import { logger } from './services/logger'
import { allianceSiege } from './actions/siege'
import { find, sample } from 'lodash'

const treasureHunt = async () => {
	const status = await goat.events.treasureHunt.eventInfos()
	logger.log('---Treasure Hunt---')

	let shovels = status.cons
	const quests = status.cfg.chutou.filter(q => q.has >= q.max && q.isGet === QUEST_STATUS.FINISHED)
	for (const quest of quests) {
		await goat.events.treasureHunt.claimShovel(quest.id)
		shovels++
		logger.log(`Claiming quest ${quest.msg}`)
	}

	for (let i = 0; i < shovels; i++) {
		await goat.events.treasureHunt.dig()
		logger.log('digging')
	}

	if (!shovels) { return }
	const updated = await goat.events.treasureHunt.eventInfos()
	for (const rwd of updated.cfg.rwd) {
		if (rwd.items.length && rwd.isGet === RWD_STATUS.READY) {
			await goat.events.treasureHunt.openChest(rwd.id)
			logger.log('Opened a chest')
		}
	}
}
const divining = async () => {
	const status = await goat.events.divining.eventInfos()
	logger.log('---Divining---')
	if (!status.info.starSign) {
		await goat.events.divining.selectStarSign()
	}

	const stargaze = status.info.surplusFreeNum
	for (let i = 0; i < stargaze; i++) {
		await goat.events.divining.stargaze()
		logger.log('stargazing')
	}
}
const coronation = async () => {
	const status = await goat.events.coronation.eventInfos()
	logger.log('---Coronation---')
	const banners = find(status.shop, s => s.items.id === 256)

	if (!banners) { return}
	for (let i = 0; i < banners.limit; i++) {
		await goat.events.coronation.buyShopItem(CORONATION_ITEM.BANNER)
		await goat.events.coronation.useItem(256)
	}
}
const giftOfTheFae = async () => {
	const status: GiftOfTheFaeStatus = await goat.events.giftOfTheFae.eventInfos()
	logger.log('---Gift of the Fae---')

	if (!status.info.gj.length) {
		await goat.events.giftOfTheFae.openFreeTree()
	}

	for (const tree of status.info.gj) {
		if (!tree.hasFreeFastNum) {await goat.events.giftOfTheFae.useQuickCollect(tree.id)}

		for (let i = tree.hasFreeExtraNum; i < 100; i++) {
			await goat.events.giftOfTheFae.useExtraOutput(tree.id)
		}
		for (let i = 0; i < status.info.fastNum; i++) {
			await goat.events.giftOfTheFae.useQuickCollect(tree.id)
			console.log('used quick collect')
			status.info.fastNum--
		}
	}

	for (const pool of status.hecheng.hecheng) {
		if (!pool.choosed) {
			const rwd = sample(status.cfg.freeCompose.item)
			await goat.events.giftOfTheFae.selectPoolReward(rwd?.idd)
			console.log('Selected pool reward')
		}

		const maxWater = pool.type === 1 ? 300000 : 1500000
		const pour = Math.min(status.info.luShuiNum, maxWater - status.info.luShuiNum)
		if (pool.num < maxWater && pour) {
			await goat.events.giftOfTheFae.pourDew(pour, pool.id)
			status.info.luShuiNum -= pour
			console.log(`Poured ${pour} water, ${status.info.luShuiNum} left`)
		}
	}
}

export const doEvents = async (): Promise<void> => {
	const status = await goat.profile.getGameInfos()
	const events = status.huodonglist.all

	if (status.kuaCLubBattle && status.kuaCLubBattle.data.type !== 0) {
		await allianceSiege()
	}

	let faeDone = false
	for (const event of events) {
		if (event.type === 17 && isFuture(fromUnixTime(event.eTime))) { await treasureHunt() }
		if (event.type === 1123 && event.id === 1123 && isFuture(fromUnixTime(event.eTime))) { await divining() }
		if (event.type === 7 && isFuture(fromUnixTime(event.eTime))) { await coronation() }
		if (event.type === 1299 && isFuture(fromUnixTime(event.eTime)) && !faeDone) {faeDone = true; await giftOfTheFae() }
	}
}
