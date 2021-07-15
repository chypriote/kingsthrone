import { goat } from '../services/requests'
import { logger } from '../services/logger'

export enum DECREE_TYPE {
	RESOURCES= 1,
	EXPERIENCE= 2,
}

export const getThroneRoom = async (): Promise<void> => {
	try {
		if (await goat.getAllLevies())
			logger.success('Levies collected')
	} catch (e) {
		logger.error(`[LEVIES] ${e}`)
	}

	try {
		if (await goat.getAllDecreesResources(DECREE_TYPE.RESOURCES))
			logger.success('Decrees enacted')
	} catch (e) {
		logger.error(`[DECREES] ${e}`)
	}
}
export const visitInLaws = async (): Promise<void> => {
	try {
		await goat.visitInLaws()
		logger.success('Visited in laws')
	} catch (e) {
		logger.error(e)
	}
}
export const hostCouncil = async (): Promise<void> => {
	try {
		const status = await goat.visitCouncil()
		if (status !== null) { return }
	} catch (e) {/* do nothing */}

	try {
		await goat.hostCouncil(3)
		logger.success('Hosted a council')
	} catch (e) {
		logger.error(`[COUNCIL] ${e}`)
	}
}
export const raiseSons = async (): Promise<void> => {
	const sons = (await goat.getGameInfos()).son.sonList

	for (const son of sons.filter(s => !s.name)) {
		await goat.nameSon(son.id)
		logger.warn(`Named son ${son.id}`)
	}
	for (const son of sons.filter(s => s.state === 3)) {
		await goat.evaluateSon(son.id)
		logger.warn(`Evaluated son ${son.id}`)
	}
	try {
		if (await goat.raiseAllSons())
			logger.success('Children raised')
	} catch (e) {
		logger.error(`[CHILDREN] ${e}`)
	}
}
export const refreshTraining = async (): Promise<void> => {
	try {
		if (await goat.finishTraining()) {
			await goat.startTraining()
			logger.success('Training refreshed')
		}
	} catch (e) {
		logger.error(`[TRAINING] ${e}`)
	}
}

