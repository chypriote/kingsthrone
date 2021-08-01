import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { DECREE_TYPE } from 'kingsthrone-api/lib/types/ThroneRoom'

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
		logger.error(e)
	}
}
export const hostCouncil = async (): Promise<void> => {
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
		if (await goat.profile.finishTraining()) {
			await goat.profile.startTraining()
			logger.success('Training refreshed')
		}
	} catch (e) {
		logger.error(`[TRAINING] ${e}`)
	}
}

