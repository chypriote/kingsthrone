import { goat, KingdomExpInfo } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { Progress } from '../services/progress'

const getNextLevel= (current: number): number => {
	const test = current.toString()
	const nb = test[test.length - 1]

	return nb === '6' ? current + 99995 : current + 1
}

const getRewards = async (current: number, rewards: { id:number, status: number }[]): Promise<void> => {
	const max = Math.round(current / 100000) - 1
	let i = (rewards[rewards.length - 1]).id

	for (i; i < max; i++) {
		await goat.expeditions.claimKingdomExpReward(i)
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
		await getRewards(status.maxLevel, status.chapterPhasesRwd)
	} catch (e) {
		logger.error(`[KEXPEDITIONS] ${e.toString()}`)
		console.log(e)
	}
}
