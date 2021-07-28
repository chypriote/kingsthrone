import { goat, KingdomExpInfo } from 'kingsthrone-api'
import { orderBy } from 'lodash'
import { logger } from '../services/logger'
import { Progress } from '../services/progress'

const getNextLevel= (current: number): number => {
	const test = current.toString()
	const nb = test[test.length - 1]

	return nb === '6' ? current + 99995 : current + 1
}

const getRewards = async (rewards: { id:number, status: number }[]): Promise<void> => {
	const ordered = orderBy(rewards, 'id', 'desc')
	let next = ordered[0].id + 1

	let goNext = true
	while (goNext) {
		try {
			await goat.expeditions.claimKingdomExpReward(next)
			console.log(`Claimed reward for ${next}`)
			next++
		} catch (e) {
			goNext = false
		}
	}
}
const getGlobalRewards = async (rewards: {level: number, num: number}[]): Promise<void> => {
	const ordered = orderBy(rewards, 'level', 'desc')
	let next = ordered[0].level + 500000

	let goNext = true
	while (goNext) {
		try {
			await goat.expeditions.claimKingdomFirstReward(next)
			console.log(`Claimed global reward for ${next}`)
			next += 500000
		} catch (e) {
			goNext = false
		}
	}
}

const doExpeditions = async (status: KingdomExpInfo): Promise<void> => {
	let next = getNextLevel(status.maxLevel)
	let available = status.playNum

	if (!available) { return }

	const progress = new Progress('Kingdom Expeditions', available)

	while (available) {
		const status = await goat.expeditions.doKingdomExpedition(next)
		next = getNextLevel(status.maxLevel)
		available = status.playNum
		progress.increment()
	}
	progress.stop()
}

export const doKingdomExpeditions = async (): Promise<void> => {
	const status = await goat.expeditions.getKingdomExpStatus()

	try {
		await doExpeditions(status)
		await getRewards(status.chapterPhasesRwd)
		await getGlobalRewards(status.firstAllRwd)
	} catch (e) {
		logger.error(`[KEXPEDITIONS] ${e.toString()}`)
		console.log(e)
	}
}
