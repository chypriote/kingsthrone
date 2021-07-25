import { GiftOfTheFaeStatus } from 'kingsthrone-api/lib/types/Events'
import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { sample } from 'lodash'

let status: GiftOfTheFaeStatus

const handleTree = async (tree): Promise<void> => {
	if (!tree.hasFreeFastNum) {await goat.events.giftOfTheFae.useQuickCollect(tree.id)}

	for (let i = tree.hasFreeExtraNum; i < 100; i++) {
		await goat.events.giftOfTheFae.useExtraOutput(tree.id)
	}
	for (let i = 0; i < status.info.fastNum; i++) {
		await goat.events.giftOfTheFae.useQuickCollect(tree.id)
		console.log('used quick collect')
	}
}

const handlePool = async (pool): Promise<void> => {
	if (!pool.choosed) {
		const rwd = sample(status.cfg.freeCompose.item)
		await goat.events.giftOfTheFae.selectPoolReward(rwd?.idd)
		console.log('Selected pool reward')
	}

	const maxWater = pool.type === 1 ? 300000 : 1500000
	const pour = Math.min(status.info.luShuiNum, maxWater - pool.num)
	if (pool.num < maxWater && pour) {
		await goat.events.giftOfTheFae.pourDew(pour, pool.id)
		status.info.luShuiNum -= pour
		pool.num += pour
		console.log(`Poured ${pour} water, ${status.info.luShuiNum} left`)
	}

	if (pool.num === maxWater) {
		await goat.events.giftOfTheFae.praiseTheSun(pool.id)
		await goat.events.giftOfTheFae.claimPoolItem(pool.id)
	}
}

export const giftOfTheFae = async (): Promise<void> => {
	status = await goat.events.giftOfTheFae.eventInfos()
	logger.log('---Gift of the Fae---')

	if (!status.info.gj.length) {
		await goat.events.giftOfTheFae.openFreeTree()
	}

	for (const tree of status.info.gj) {
		await handleTree(tree)
	}

	for (const pool of status.hecheng.hecheng) {
		await handlePool(pool)
	}
}
