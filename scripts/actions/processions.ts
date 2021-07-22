import { find } from 'lodash'
import { goat, ProcessionGain } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { NPCS } from 'kingsthrone-api/lib/types/Processions'
import { Progress } from '../services/progress'

function getItem(id: number): string {
	switch (id) {
	case 2: return 'gold'
	case 3: return 'grain'
	case 4: return 'soldiers'
	default: return 'unknown'
	}
}
function getNpc(id: number): {nid:number, name: string, visits: number} {
	let npc = find(NPCS, m => m.nid == id)

	if (!npc) {
		npc = { nid: id, name: 'Unknown', visits: 0 }
		NPCS.push(npc)
	}

	return npc
}

const writeResult = (result: ProcessionGain) => {
	const npc = getNpc(result.npcid)
	let gain = ''
	switch (result.type) {
	case 5: gain = 'intimacy'; break
	case 1:
		gain = `${result.items[0].count} ${getItem(result.items[0].id)}`; break
	default: gain = 'unknown'
	}

	logger.log(`Visited npc ${npc.name} (${npc.nid}) got ${gain}`)
}

const state = {
	availableProcessions: 0,
	usedDraught: 0,
	visits: 0,
	availableDraught: 0,
}

const useDraught = async (count = 1): Promise<void> => {
	const draught = await goat.processions.useGoodwillDraught(count)
	state.availableDraught = draught.items.count
	state.availableProcessions = draught.status.num
	state.usedDraught++
}

export const doProcessions = async (count = 0, draughts = 0): Promise<void> => {
	const available = await goat.processions.getAvailableProcessions()
	const visitsPerDraughts = goat._isGautier() ? 3 : 5
	state.availableProcessions = available.num

	if (!state.availableProcessions && (count || draughts)) {
		await useDraught()
	}

	const todo = Math.max(count, draughts * visitsPerDraughts, state.availableProcessions)
	if (!todo) { return }

	const progress = new Progress('Processions', todo, 'done')

	while (state.availableProcessions) {
		const { result } = await goat.processions.startProcession()
		const npc = getNpc(result.npcid)
		npc.visits++
		state.visits++
		state.availableProcessions--
		progress.increment()

		if (state.availableProcessions === 0 && (state.visits < count || state.usedDraught < draughts)) {
			await useDraught()
		}
	}
	progress.stop()
}
