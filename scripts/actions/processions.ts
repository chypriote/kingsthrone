import { find } from 'lodash'
import { NPCS, ProcessionGain } from '../../types/goat/Processions'
import { goat } from '../services/requests'
import { logger } from '../services/logger'

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
	logger.log('using draught')
	const draught = await goat.useGoodwillDraught(count)
	state.availableDraught = draught.items.count
	state.availableProcessions = draught.status.num
	state.usedDraught++
}

export const doProcessions = async (count = 0): Promise<void> => {
	const available = await goat.getAvailableProcessions()
	state.availableProcessions = available.num

	if (!state.availableProcessions && count) {
		logger.log('No processions available, using draught')
		await useDraught()
	}

	while (state.availableProcessions && (!count || state.visits < count)) {
		const { result } = await goat.startProcession()
		writeResult(result)
		const npc = getNpc(result.npcid)
		npc.visits++
		state.visits++
		state.availableProcessions--

		if (state.availableProcessions === 0 && state.visits < count) {
			await useDraught()
		}
	}

	// console.log(NPCS)
	logger.success(`Finished visited ${state.visits} npcs and used ${state.usedDraught} draughts (${state.availableDraught} left)`)
}
