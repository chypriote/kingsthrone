import { find } from 'lodash'
import { goat } from 'kingsthrone-api'
import { MAIDENS } from 'kingsthrone-api/lib/types/Maidens'
import { Progress } from '../services/progress'
import { client } from '../services/database'

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
	const visitsPerDraughts = 5
	state.availableVisits = available.num

	if (!state.availableVisits && (count || draughts)) {
		await useDraught()
	}

	const todo = Math.max(count, draughts * visitsPerDraughts, state.availableVisits)
	if (!todo) { return }

	const progress = new Progress('Maiden visits', todo, 'done')

	while (state.availableVisits) {
		const wife = await goat.maidens.visitRandomMaiden()
		const maiden = getMaiden(wife.id)
		//		if (maiden.name === 'Unknown') {console.log(JSON.stringify(wife))}
		maiden.visits++
		state.visits++
		state.availableVisits--
		progress.increment()

		if (state.availableVisits === 0 && (state.visits < count || state.usedDraught < draughts)) {
			await useDraught()
		}
	}
	progress.stop()
}
