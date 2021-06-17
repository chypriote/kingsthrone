import { goat } from '../services/requests'
import { logger } from '../services/logger'

const getNextLevel= (current: number): number => {
	const test = current.toString()
	const nb = test[test.length - 1]

	return nb === '6' ? current + 99995 : current + 1
}

export const doKingdomExpeditions = async (): Promise<void> => {
	const status = await goat.getKingdomExpStatus()
	let next = getNextLevel(status.maxLevel)
	let available = status.playNum

	while (available) {
		const status = await goat.sendKingdomExp(next)
		next = getNextLevel(status.maxLevel)
		available = status.playNum
	}
	logger.success('Did kingdom expeditions')
}
