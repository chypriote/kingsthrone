import { find } from 'lodash'
import { MAIDENS } from '../../types/goat/Maidens'
import { goat } from '../services/requests'
import { logger } from '../services/logger'

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
	const draught = await goat.useStaminaDraught(count)
	state.availableDraught = draught.items.count
	state.availableVisits = draught.status.num
	state.usedDraught++
}

export const visitMaidens = async (count = 0): Promise<void> => {
	const available = await goat.getAvailableVisits()
	state.availableVisits = available.num

	if (!state.availableVisits && count) {
		await useDraught()
	}

	while (state.availableVisits && (!count || state.visits < count)) {
		const wife = await goat.visitRandomMaiden()
		const maiden = getMaiden(wife.id)
		maiden.visits++
		state.visits++
		state.availableVisits--

		if (state.availableVisits === 0 && state.visits < count) {
			await useDraught()
		}
	}

	if (state.visits > 0)
		logger.success(`Visited ${state.visits} maidens ${ state.usedDraught > 0 ? `and used ${state.usedDraught} draughts (${state.availableDraught} left)` : ''}`)
}
