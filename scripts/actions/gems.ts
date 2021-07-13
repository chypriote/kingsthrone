import chalk = require('chalk')
import { goat } from '../services/requests'
const cliProgress = require('cli-progress')

export const getGems = async (count: number|null = null): Promise<void> => {
	const progress = new cliProgress.SingleBar({
		format: `Gems | ${chalk.cyanBright('{bar}')} | {value}${ count ? '/{total}' : ''} gems`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(count ?? 100000, 0)

	let gems = 0
	while (!count || gems < count) {
		gems += await (goat.events()).castle.findEgg()
		await (goat.events()).castle.claimEgg()
		progress.update(gems)
	}
	progress.stop()
}
