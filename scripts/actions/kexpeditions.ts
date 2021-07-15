import { goat } from '../services/goat'
import { logger } from '../services/logger'

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

export const doKingdomExpeditions = async (): Promise<void> => {
	const status = await goat.expeditions.getKingdomExpStatus()

	let next = getNextLevel(status.maxLevel)
	let available = status.playNum

	try {
		while (available) {
			const status = await goat.expeditions.doKingdomExpedition(next)
			next = getNextLevel(status.maxLevel)
			available = status.playNum
		}
		logger.success('Did kingdom expeditions')
	} catch (e) {
		logger.error(JSON.stringify(e, null, 2))
	}

	try {
		await getRewards(status.maxLevel, status.chapterPhasesRwd)
	} catch (e) {
		console.log(e)
	}
}
