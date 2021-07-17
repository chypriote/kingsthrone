import chalk = require('chalk')
import { goat } from 'kingsthrone-api'
const cliProgress = require('cli-progress')

export const getGems = async (count: number|null = null): Promise<void> => {
	const progress = new cliProgress.SingleBar({
		format: `Gems\t| ${chalk.cyanBright('{bar}')} | {value}${ count ? '/{total}' : ''} gems | {duration_formatted} (ETA: {eta_formatted})`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(count ?? 100000, 0)

	let gems = 0
	while (!count || gems < count) {
		gems += await goat.events.castle.findEgg()
		await goat.events.castle.claimEgg()
		progress.update(gems)
	}
	progress.stop()
}
