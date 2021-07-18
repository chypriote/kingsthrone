import chalk from 'chalk'
import { goat, KingdomExpInfo } from 'kingsthrone-api'

const cliProgress = require('cli-progress')

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

	const progress = new cliProgress.SingleBar({
		format: `Expeditions\t| ${chalk.green('{bar}')} | {value}/{total}`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(available, 0)

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
		console.log(e)
	}
}
