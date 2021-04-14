import { client, LOGIN_ACCOUNT_GAUTIER } from './services/requests'
import { logger } from './services/logger'
import { find, reduce } from 'lodash'

const account = LOGIN_ACCOUNT_GAUTIER
const processionsPerDraught = 3
const draughtsToKeep = 840

const NPCS = [
	{ nid: 3, name: 'Lonely Tom', visits: 0 },
	{ nid: 24, name: 'Nikolai', visits: 0 },
	{ nid: 31, name: 'George', visits: 0 },
	{ nid: 32, name: 'Geoffrey', visits: 0 },
	{ nid: 41, name: 'Bill', visits: 0 },
	{ nid: 101, name: 'Theodora', visits: 0 },
	{ nid: 114, name: 'Gwyneth', visits: 0 },
	{ nid: 121, name: 'Eleanor', visits: 0 },
]
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

export const doProcession = async (): Promise<void> => {
	await client.login(account)
	const available = await client.getAvailableProcessions()
	let availableProcessions = available.num
	let availableDraught = 1000
	let usedDraught = 0

	if (!availableProcessions) {
		console.log('No processions available, using draught')
		availableDraught = (await client.useGoodwillDraught()).count
		usedDraught++
		availableProcessions += processionsPerDraught
	}

	while (availableProcessions) {
		const { result } = await client.startProcession()
		let gain = ''
		const npc = getNpc(result.npcid)
		npc.visits++
		availableProcessions--
		switch (result.type) {
		case 5: gain = 'intimacy'; break
		case 1:
			gain = `${result.items[0].count} ${getItem(result.items[0].id)}`; break
		default: gain = 'unknown'
		}

		console.log(`Visited npc ${npc.name} (${npc.nid}) got ${gain}`)

		if (availableProcessions === 0 && availableDraught > draughtsToKeep) {
			availableDraught = (await client.useGoodwillDraught()).count
			usedDraught++
			availableProcessions += processionsPerDraught
		}
	}

	console.log(NPCS)
	logger.success(`Finished visited ${reduce(NPCS, (t, m) => t + m.visits, 0)} npcs and used ${usedDraught} draughts (${availableDraught} left)`)
}


doProcession().then(() => process.exit())
