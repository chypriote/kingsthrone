import { find } from 'lodash'
import { goat } from 'kingsthrone-api'
import { CHERISHED_WISH_TYPE, CherishedWishInfo, CherishedWishReward } from 'kingsthrone-api/lib/types/Events'
import { logger } from '../services/logger'

async function wishTreeQuest(info: CherishedWishInfo, rewards: CherishedWishReward[], today: number, type: CHERISHED_WISH_TYPE): Promise<void> {
	const optional = find(info.optional, op => op.dc === today)

	if (!optional) {
		const options = find(rewards, r => r.id === today)
		if (!options) { return logger.error(`Could not find options for day ${today}, type ${type}`) }

		for (const rwd of options.optionRwd) {
			await goat.events.renownedMerchant.setWishTreeReward(1, today, rwd.pos)
			logger.log('Set wish tree reward')
		}
	}

	const todaysRwd = find(info.rwd, r => r.id === today)
	if (!todaysRwd || todaysRwd.status === 1) { return }
	try {
		await goat.events.renownedMerchant.getWishTreeReward(type)
		console.log(`Claimed login reward of for day ${today} of type ${type}`)
	} catch (e) {/*do nothing*/}
}
const doWishTree = async (): Promise<void> => {
	const wishTree = await goat.events.renownedMerchant.wishTreeInfos()
	const [signIn, gems] = wishTree.info
	const today = wishTree.info[wishTree.info.length - 1].today || 0

	await wishTreeQuest(signIn, wishTree.cfg.sign_rwd, today, CHERISHED_WISH_TYPE.SIGN_IN)
	await wishTreeQuest(gems, wishTree.cfg.gems_rwd, today, CHERISHED_WISH_TYPE.GEMS)
	//disabled because we don't buy vip items
	// await wishTreeQuest(vip, wishTree.cfg.vip_rwd, today, CHERISHED_WISH_TYPE.VIP)
}

const doLoginRewards = async (): Promise<void> => {
	const loginRewards = await goat.events.renownedMerchant.loginRewardsInfo()

	for (const daily of loginRewards.cfg.dayTasks) {
		for (const task of daily.task_id) {
			try {
				await goat.events.renownedMerchant.getTaskReward(daily.day, task)
				logger.log(`Claimed reward of task ${task} of day ${daily.day}`)
			} catch (e) {/*do nothing*/}
		}
	}
}

export const renownedMerchant = async (): Promise<void> => {
	logger.log('---Renowned Merchant---')
	const topUp = await goat.events.renownedMerchant.continualTopUpInfos()
	if (!topUp.hasGetBox) {
		await goat.events.renownedMerchant.getContinualTopUp()
	}
	await doWishTree()
	await doLoginRewards()
}

