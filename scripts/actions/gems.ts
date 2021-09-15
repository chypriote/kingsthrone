import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'
const chalk = require('chalk')
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

export const claimCards = async (): Promise<void> => {
	try { await goat.card.weekly(); logger.success('Claimed weekly card') } catch (e) {/**/}
	try { await goat.card.monthly(); logger.success('Claimed monthly card') } catch (e) {/**/}
	try { await goat.card.season(); logger.success('Claimed season card') } catch (e) {/**/}
}
