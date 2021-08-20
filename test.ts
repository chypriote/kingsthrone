import { logger } from './scripts/services/logger'
import { client } from './scripts/services/database'
import { goat } from 'kingsthrone-api'
import { ACCOUNT_GAUTIER, ACCOUNT_NAPOLEON } from 'kingsthrone-api/lib/src/goat'
import { Progress } from './scripts/services/progress'
import { chunk, orderBy } from 'lodash'
import { Goat } from 'kingsthrone-api/lib'
import { IAccount } from 'kingsthrone-api/lib/src/GoatResource'
import axios from 'axios'
const winston = require('winston')


const getTarget = async (): Promise<string> => {
	const status = await goat.events.allianceSiege.eventInfos()

	const members = orderBy(status.data.members, 'shili', 'asc')

	return members[0].id.toString()
}
const spamAllianceSiege = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const todo = 100
	const progress = new Progress('Attacking', todo)
	const target = await getTarget()
	for (let i = 0; i < todo; i++) {
		await goat.events.allianceSiege.buySiegeWeapon(10)
		// await goat.events.allianceSiege.attackWall(10)
		await goat.events.allianceSiege.attackMember(target, 10)
		progress.increment()
	}
	progress.stop()
}
const buyShopPack = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	goat._setServer('1094')
	const toBuy = 100
	const progress = new Progress('Buying packs', toBuy)
	for (let i = 0; i < toBuy; i++) {
		await goat.shop.buyShopPack(4)
		progress.increment()
	}
	progress.stop()
}
const buyAllianceSiegeShopScrolls = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const progress = new Progress('Buying scrolls', 20)
	for (let i = 0; i < 20; i++) {
		await goat.events.allianceSiege.buyDailyShop(13)
		progress.increment()
	}
	progress.stop()
}
const mainQuest = async () => {
	goat._setAccount(ACCOUNT_NAPOLEON)
	const task = (await goat.profile.getGameInfos()).task.tmain

	let goNext = task.num >= task.max
	let next = task.id
	while (goNext) {
		try {
			await goat.account.doMainQuestTask(next)
			console.log(`Claimed reward for ${next}`)
			next++
		} catch (e) {
			goNext = false
		}
	}
}
const checkItems = async () => {
	const todo: [IAccount, string][] = [
		[ACCOUNT_GAUTIER, '699'],
		[ACCOUNT_NAPOLEON, '699'],
		[ACCOUNT_GAUTIER, '1094'],
	]

	for (const [account, server] of todo) {
		goat._logout()
		goat._setAccount(account)
		goat._setServer(server)
		const existing = (await client('items')).map((i) => i.id)

		const bag = await goat.items.getBag()
		for (const item of bag) {
			if (!existing.includes(item.id)) {
				console.log(`Item ${item.id} not registered (own ${item.count})`)
			}
		}
	}
}
const doCampaign = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const campaign = (await goat.profile.getGameInfos()).user.guide

	let currentSmap = campaign.smap
	let currentBmap = campaign.bmap
	let currentMmap = campaign.mmap

	let next = true
	while (next) {
		try {
			for (let i = 0; i < 5; i += 1) {
				await goat.account.doCampaignGuide(currentSmap, currentBmap, currentMmap)
				await goat.campaign.oneKeyPve()
				console.log(`Did battle ${currentMmap}-${currentSmap}`)
				currentSmap += i * 8
				currentMmap++
			}
			await goat.campaign.fightCampaignBoss(68)
			console.log(`Did boss ${currentBmap}`)
			currentBmap++
		} catch (e) {
			next = false
		}
	}
}

const w = winston.createLogger({
	level: 'info',
	format: winston.format.simple(),
	transports: [],
})
w.add(new winston.transports.File({
	filename: 'servers.csv',
}))
const recordRank = async (server: number|string): Promise<void> => {
	const goat = new Goat()
	goat._setServer(server.toString())
	try {
		if (server !== 256 && server < 1071 && server !== 1053) {
			const rank = await goat.xServerTourney.xsGetRankings()
			const data = await goat.limitedTimeQuests._unsafe({ 'huodong':{ 'hdGetXSRank':{ 'type':201 } } })
			const gems: {name: string, rid: number, score: number, uid: number}[] = data.a.xshuodong.xsRank.xsRank

			w.info(`${server},${rank.severScore.myScore},${gems[0].score},${gems[0].name},${gems[1].score},${gems[1].name},${gems[2].score},${gems[2].name}`)
		} else {
			await goat.limitedTimeQuests.spendGems()
			const data = await goat.limitedTimeQuests._unsafe({ 'huodong':{ 'hdGetXSRank':{ 'type':201 } } })
			const gems: {name: string, rid: number, score: number, uid: number}[] = data.a.xshuodong.xsRank.xsRank

			w.info(`${server},NORANK,${gems[0].score},${gems[0].name},${gems[1].score},${gems[1].name},${gems[2].score},${gems[2].name}`)
		}
	} catch (e) {
		w.info(`${server},ERROR,${e.toString()}`)
	}
}
const recordXServerPointsAndGems = async () => {
	const servers = (await client('servers')
		.min('id')
		.groupBy('merger')
		.orderBy('min')).map(sv => sv.min)

	const seconds = (await client('servers')
		.select('id')
		.whereNull('merger')).map(sv => sv.id)

	const test = [...servers, ...seconds]

	w.info('Server,Points,1stGem,1st,2ndGem,2nd,3rdGem,3rd')
	const chunks: number[][] = chunk(test, 20)
	for (const ck of chunks) {
		const promises = []
		for (const server of ck) {
			promises.push(recordRank(server))
		}
		await Promise.all(promises)
	}
}
const doExpedition = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	// goat._setServer('1094')
	await goat.expeditions.doKingdomExpedition(13000005)
	await goat.expeditions.doKingdomExpedition(13000006)
	await goat.expeditions.doKingdomExpedition(13100001)
	await goat.expeditions.doKingdomExpedition(13100002)
	await goat.expeditions.doKingdomExpedition(13100003)
	await goat.expeditions.doKingdomExpedition(13100004)
	await goat.expeditions.doKingdomExpedition(13100005)
	await goat.expeditions.doKingdomExpedition(13100006)
	await goat.expeditions.doKingdomExpedition(13200001)
	await goat.expeditions.doKingdomExpedition(13200002)
}
const test = async () => {
	const test =(await goat.profile.getGameInfos()).huodonglist.all
	console.log(test)
}

doExpedition().then(() => {
	logger.success('Finished')
	process.exit()
})
