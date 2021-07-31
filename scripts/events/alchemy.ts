import { filter, find, orderBy } from 'lodash'
import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { AlchemyLuckBoost, AlchemyStatus } from 'kingsthrone-api/lib/types/Events'
import { useAllItems } from '~/scripts/actions/items'

const selectBoost = (boosts: AlchemyLuckBoost[], owned: number[]|null = null): AlchemyLuckBoost => {
	if (owned) {
		return orderBy(
			filter(boosts, b => owned.includes(b.id)),
			['bj', 'num'],
			['desc', 'desc']
		)[0]
	}
	return orderBy(boosts, ['bj', 'num'], ['desc', 'desc'])[0]
}

const getRewards = async (status: AlchemyStatus): Promise<void> => {
	try {
		for (const task of status.task.tasks) {
			const todo = find(status.task.taskscfg, cfg => cfg.type == task.id)
			if (!todo) { continue }
			const goal = find(todo.dcCfg, g => g.id === task.rwd)
			if (!goal || goal.max > task.num) { continue }

			await goat.events.alchemy.claimQuest(task.id)
			console.log(`Claiming reward for task ${task.id}`)
		}
	} catch (e) {
		logger.error(`Trade ${e}`)
		console.trace()
	}
}

const handleGifts = async (status: AlchemyStatus): Promise<void> => {
	const sons = orderBy(
		filter((await goat.profile.getGameInfos()).son.sonList, s => s.state === 2 && s.level > 4),
		'exp', 'desc'
	)
	let total = status.info.receiveNum
	if (total >= 10 || !sons.length) { return }
	const kid = sons[0]

	try {
		for (const received of status.info.receive) {
			if (received.status == 1) { continue }
			await goat.events.alchemy.receiveGift(received.uid, kid.id)
			total++
		}
	} catch (e) {
		logger.error(`Receive ${e}`)
		console.trace()
	}

	try {
		const flist = await goat.account.getFriendList()
		const sent = status.info.send.map(f => f.uid.toString())
		for (const inlaw of flist.qjlist) {
			if (sent.includes(inlaw.uid.toString())) {continue}
			await goat.events.alchemy.sendGift(parseInt(inlaw.uid), kid.id)
			logger.log(`Sent gift to ${inlaw.name}`)
		}
		for (const friend of flist.flist) {
			if (sent.includes(friend.uid.toString())) {continue}
			await goat.events.alchemy.sendGift(parseInt(friend.uid), kid.id)
			logger.log(`Sent gift to ${friend.name}`)
		}
	} catch (e) {
		logger.error(`Sebd ${e}`)
		console.trace()
	}
}

const trade = async (status: AlchemyStatus): Promise<void> => {
	try {
		const wives = ((await goat.profile.getGameInfos()).wife.wifeList).map(w => parseInt(w.id.toString()))
		const maiden = selectBoost(status.cfg.wifeCfg, wives)
		const max = 100 - status.info.completeNum
		const iron = status.info.milkNum
		const bottles = iron + status.info.biscuitsNum <= max ?
			status.info.biscuitsNum :
			max - iron

		await goat.events.alchemy.trade(iron, bottles, maiden.id)
		logger.log(`Traded ${iron} iron and ${bottles} bottles`)
	} catch (e) {
		logger.error(`Trade ${e}`)
		console.trace()
	}
}

export const alchemy = async (): Promise<void> => {
	logger.log('---Alchemy---')
	const status = await goat.events.alchemy.eventInfos()
	const chests = (await goat.items.getBag()).filter(i => i.id === 14012)
	if (chests.length) {
		await goat.items.use(14012, chests[0].count)
	}

	if (status.info.completeNum === 100) {
		await goat.events.alchemy.claimCompleteReward()
		status.info.completeNum = 0
	}

	await getRewards(status)
	await handleGifts(status)
	await trade(status)
}
