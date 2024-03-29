import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { DECREE_TYPE } from 'kingsthrone-api/lib/types/ThroneRoom'
import { find } from 'lodash'

export const getThroneRoom = async (): Promise<void> => {
	try {
		if (await goat.throneRoom.getAllLevies())
			logger.success('Levies collected')
	} catch (e) {
		logger.error(`[LEVIES] ${e}`)
	}

	try {
		if (await goat.throneRoom.getAllDecreesResources(DECREE_TYPE.RESOURCES))
			logger.success('Decrees enacted')
	} catch (e) {
		logger.error(`[DECREES] ${e}`)
	}
}
export const visitInLaws = async (): Promise<void> => {
	try {
		await goat.children.visitInLaws()
		logger.success('Visited in laws')
	} catch (e) {
		logger.error(`[INLAWS] ${e}`)
	}
}
export const hostCouncil = async (): Promise<void> => {
	const coins = find(await goat.items.getBag(), i => i.id === 133)
	if (!coins || !coins.count) { return }

	try {
		const status = await goat.profile.visitCouncil()
		if (status !== null) { return }
	} catch (e) {/* do nothing */}

	try {
		await goat.profile.hostCouncil(3)
		logger.success('Hosted a council')
	} catch (e) {
		logger.error(`[COUNCIL] ${e}`)
	}
}
export const refreshTraining = async (): Promise<void> => {
	try {
		const status = (await goat.profile.getGameInfos()).school.list

		if (status[0].cd.next !== 0) { return }
		await goat.profile.finishTraining()
		await goat.profile.startTraining()
		logger.success('Training refreshed')
	} catch (e) {
		if (e.toString() === 'Error: All dummies have been occupied') { return }
		logger.error(`[TRAINING] ${e}`)
	}
}
export const claimCards = async (): Promise<void> => {
	try {await goat.card.weekly(); logger.success('Claimed weekly card')} catch (e) {/**/}
	try {await goat.card.monthly(); logger.success('Claimed monthly card')} catch (e) {/**/}
	try {await goat.card.season(); logger.success('Claimed season card')} catch (e) {/**/}
}

