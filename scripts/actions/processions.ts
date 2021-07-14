import { find } from 'lodash'
import chalk from 'chalk'
import { NPCS, ProcessionGain } from '../../types/goat/Processions'
import { goat } from '../services/requests'
import { logger } from '../services/logger'
const cliProgress = require('cli-progress')

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
	const draught = await goat.useGoodwillDraught(count)
	state.availableDraught = draught.items.count
	state.availableProcessions = draught.status.num
	state.usedDraught++
}

export const doProcessions = async (count = 0, draughts = 0): Promise<void> => {
	const available = await goat.getAvailableProcessions()
	const visitsPerDraughts = goat.gid === '699002934' ? 3 : 5
	state.availableProcessions = available.num

	if (!state.availableProcessions && (count || draughts)) {
		await useDraught()
	}

	const todo = Math.max(count, draughts * visitsPerDraughts, state.availableProcessions)
	if (!todo) { return }

	const progress = new cliProgress.SingleBar({
		format: `Processions\t| ${chalk.green('{bar}')} | {value}/{total} done${ state.usedDraught ? ', {draughts} draughts' : ''}`,
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true,
	})
	progress.start(todo, state.visits, { draughts: state.usedDraught })

	while (state.availableProcessions) {
		const { result } = await goat.startProcession()
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

	// console.log(NPCS)
}
