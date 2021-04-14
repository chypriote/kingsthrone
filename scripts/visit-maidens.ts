import { client, LOGIN_ACCOUNT_NAPOLEON, LOGIN_ACCOUNT_GAUTIER } from './services/requests'
import { logger } from './services/logger'
import { find, reduce } from 'lodash'

const account = LOGIN_ACCOUNT_GAUTIER
const visitsPerDraught = 3
const draughtsToKeep = 300

const MAIDENS = [
	{ mid: 1, name: 'Marian', visits: 0 },
	{ mid: 2, name: 'Julia', visits: 0 },
	{ mid: 3, name: 'Isabella', visits: 0 },
	{ mid: 4, name: 'Katerina', visits: 0 },
	{ mid: 5, name: 'Margarate', visits: 0 },
	{ mid: 6, name: 'Mavia', visits: 0 },
	{ mid: 7, name: 'Gwyneth', visits: 0 },
	{ mid: 8, name: 'Constance', visits: 0 },
	{ mid: 9, name: 'Anastasia', visits: 0 },
	{ mid: 10, name: 'Joanna', visits: 0 },
	{ mid: 11, name: 'Amala', visits: 0 },
	{ mid: 12, name: 'Hildegard', visits: 0 },
	{ mid: 13, name: 'Christine', visits: 0 },
	{ mid: 14, name: 'Eleanor', visits: 0 },
	{ mid: 15, name: 'Yolanda', visits: 0 },
	{ mid: 16, name: 'Carmilla', visits: 0 },
	{ mid: 17, name: 'Vivienne', visits: 0 },
	{ mid: 18, name: 'Titania', visits: 0 },
	{ mid: 19, name: 'Theodora', visits: 0 },
	{ mid: 30, name: 'Helen', visits: 0 },
	{ mid: 35, name: 'Morrigan', visits: 0 },
]

function getMaiden(id: number): {mid:number, name: string, visits: number} {
	let wife = find(MAIDENS, m => m.mid == id)

	if (!wife) {
		wife = { mid: id, name: 'UNknown', visits: 0 }
		MAIDENS.push(wife)
	}

	return wife
}

export const visitMaidens = async (): Promise<void> => {
	await client.login(account)
	const available = await client.getAvailableVisits()
	let availableVisits = available.num
	let availableDraught = 1000
	let usedDraught = 0

	if (!availableVisits) {
		console.log('No visits available, using draught')
		availableDraught = (await client.useStaminaDraught()).count
		usedDraught++
		availableVisits += visitsPerDraught
	}

	while (availableVisits) {
		const wife = await client.visitRandomMaiden()
		const maiden = getMaiden(wife.id)
		maiden.visits++
		availableVisits--
		console.log(`Visited wife ${maiden.name} (${wife.id})`)

		if (availableVisits === 0 && availableDraught > draughtsToKeep) {
			availableDraught = (await client.useStaminaDraught()).count
			usedDraught++
			availableVisits += visitsPerDraught
		}
	}

	console.log(MAIDENS)
	logger.success(`Finished visited ${reduce(MAIDENS, (t, m) => t + m.visits, 0)} maidens and used ${usedDraught} draughts (${availableDraught} left)`)
}


visitMaidens().then(() => process.exit())
