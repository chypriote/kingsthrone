import { find } from 'lodash'
import chalk from 'chalk'
import { goat } from 'kingsthrone-api'
import { MAIDENS } from 'kingsthrone-api/lib/types/goat/Maidens'
const cliProgress = require('cli-progress')

function getMaiden(id: number): {mid:number, name: string, visits: number} {
	let wife = find(MAIDENS, m => m.mid == id)

	if (!wife) {
		wife = { mid: id, name: 'Unknown', visits: 0 }
		MAIDENS.push(wife)
	}

	return wife
}

const state = {
	availableVisits: 0,
	usedDraught: 0,
	visits: 0,
	availableDraught: 0,
}

const useDraught = async (count= 1): Promise<void> => {
	const draught = await goat.maidens.useStaminaDraught(count)
	state.availableDraught = draught.items.count
	state.availableVisits = draught.status.num
	state.usedDraught++
}

export const visitMaidens = async (count = 0, draughts = 0): Promise<void> => {
	const available = await goat.maidens.getAvailableVisits()
	const visitsPerDraughts = goat._isGautier() ? 3 : 5
	state.availableVisits = available.num

	if (!state.availableVisits && (count || draughts)) {
		await useDraught()
	}

	const todo = Math.max(count, draughts * visitsPerDraughts, state.availableVisits)
	if (!todo) { return }

	const progress = new cliProgress.SingleBar({
		format: `Maiden visits\t| ${chalk.green('{bar}')} | {value}/{total} done${ state.usedDraught ? ', {draughts} draughts' : ''}`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(todo, state.visits, { draughts: state.usedDraught })

	while (state.availableVisits) {
		const wife = await goat.maidens.visitRandomMaiden()
		const maiden = getMaiden(wife.id)
		maiden.visits++
		state.visits++
		state.availableVisits--
		progress.increment({ draughts: state.usedDraught })

		if (state.availableVisits === 0 && (state.visits < count || state.usedDraught < draughts)) {
			await useDraught()
		}
	}
	progress.stop()

	// console.log(NPCS)
}
