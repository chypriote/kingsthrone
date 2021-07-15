import { goat } from '../services/goat'
import { logger } from '../services/logger'

export enum DECREE_TYPE {
	RESOURCES= 1,
	EXPERIENCE= 2,
}

export const getThroneRoom = async (): Promise<void> => {
	try {
		if (await goat.profile.getAllLevies())
			logger.success('Levies collected')
	} catch (e) {
		logger.error(`[LEVIES] ${e}`)
	}

	try {
		if (await goat.profile.getAllDecreesResources(DECREE_TYPE.RESOURCES))
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
export const raiseSons = async (): Promise<void> => {
	const sons = (await goat.profile.getGameInfos()).son.sonList

	for (const son of sons.filter(s => !s.name)) {
		await goat.children.nameSon(son.id)
		logger.warn(`Named son ${son.id}`)
	}
	for (const son of sons.filter(s => s.state === 3)) {
		await goat.children.evaluateSon(son.id)
		logger.warn(`Evaluated son ${son.id}`)
	}
	try {
		if (await goat.children.raiseAllSons())
			logger.success('Children raised')
	} catch (e) {
		logger.error(`[CHILDREN] ${e}`)
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

