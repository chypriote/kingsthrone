import { logger } from './scripts/services/logger'
import axios from 'axios'
import { client } from './scripts/services/database'
import { format, fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { ACCOUNT_GAUTIER } from 'kingsthrone-api/lib/src/goat'
import { Progress } from './scripts/services/progress'
import { filter, map, orderBy } from 'lodash'
import { doExpedition, doKingdomExpeditions, doMerchant } from './scripts/actions'

interface GoatServer {
	he: number
	id: number
	name: string
	showtime: number
	state: number
	skin: number
	url: string
}

const getServers = async (): Promise<GoatServer[]> => {
	const servers = await axios
		.post(
			'http://ksrus.gtbackoverseas.com/serverlist.php?platform=gaotukc&lang=1',
			{
				platform: 'gaotukc',
				lang: 1,
			},
			{
				headers: {
					'Accept-Encoding': 'identity',
					'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; ONEPLUS A5000 Build/NMF26X)',
					'Content-Length': 0,
					'Content-Type': 'application/x-www-form-urlencoded',
					Connection: 'Keep-Alive',
					Host: 'ksrus.gtbackoverseas.com',
				},
			}
		)
		.then((response) => response.data)
	return servers.a.system.server_list
}

const logServer = async () => {
	const existing = (await client('servers').select('id')).map((sv) => sv.id.toString())
	const servers = await getServers()

	for (const server of servers) {
		if (existing.includes(server.id.toString())) {
			continue
		}
		await client('servers').insert({
			id: server.id,
			name: server.name,
			time: fromUnixTime(server.showtime),
			merger: server.he,
		})
	}
}

const getTarget = async (): Promise<string> => {
	const status = await goat.challenges.allianceSiege.eventInfos()
	const attacks = status.info.freeNum + status.info.buyNum

	const members = orderBy(status.data.members, 'shili', 'asc')

	return members[0].id.toString()
}
const spamAllianceSiege = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const todo = 100
	const progress = new Progress('Attacking', todo)
	const target = await getTarget()
	for (let i = 0; i < todo; i++) {
		await goat.challenges.allianceSiege.buySiegeWeapon(10)
		// await goat.challenges.allianceSiege.attackWall(10)
		await goat.challenges.allianceSiege.attackMember(target, 10)
		progress.increment()
	}
	progress.stop()
}
const buyShopPack = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	goat._setServer('691')
	const toBuy = 100
	const progress = new Progress('Buying packs', toBuy)
	for (let i = 0; i < toBuy; i++) {
		await goat.shop.buyShopPack(1)
		progress.increment()
	}
	progress.stop()
}
const buyAllianceSiegeShopScrolls = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const progress = new Progress('Buying scrolls', 20)
	for (let i = 0; i < 20; i++) {
		await goat.challenges.allianceSiege.buyDailyShop(13)
		progress.increment()
	}
	progress.stop()
}
const mainQuest = async () => {
	let next = 1553
	let goNext = true
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
	goat._setAccount(ACCOUNT_GAUTIER)
	const existing = (await client('items')).map((i) => i.id)

	const bag = await goat.items.getBag()
	for (const item of bag) {
		if (!existing.includes(item.id)) {
			console.log(`${item.count} not registered (${item.id})`)
		}
	}
}
const doCampaign = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	goat._setServer('691')
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
const doCampaign1094 = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	goat._setServer('1094')
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
			await goat.campaign.fightCampaignBoss(33)
			await goat.campaign.fightCampaignBoss(6)
			await goat.campaign.fightCampaignBoss(16)
			await goat.campaign.fightCampaignBoss(24)
			await goat.campaign._unsafe({ 'user':{ 'comeback':{ 'id':33 } } })
			console.log(`Did boss ${currentBmap}`)
			currentBmap++
		} catch (e) {
			next = false
		}
	}
	console.log(currentSmap, currentBmap, currentMmap)
}
const doTest = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	goat._setServer('1094')
	await doKingdomExpeditions()
	
	await doMerchant()

}

doTest().then(() => {+
logger.success('Finished')
process.exit()
})
