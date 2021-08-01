import { orderBy } from 'lodash'
import { goat } from 'kingsthrone-api'
import { CHILDREN_STATUS } from 'kingsthrone-api/lib/types/Children'
import { logger } from '../services/logger'

export const handleSons = async (): Promise<void> => {
	const sons = (await goat.profile.getGameInfos()).son.sonList

	for (const son of sons) {
		if (!son.name) {
			await goat.children.nameSon(son.id)
			logger.warn(`Named son ${son.id}`)
		}

		if (son.state === CHILDREN_STATUS.GROWNUP) {
			await goat.children.evaluateSon(son.id)
			logger.warn(`Evaluated son ${son.id}`)
			son.state = CHILDREN_STATUS.EVALUATED
		}

		if (son.state === CHILDREN_STATUS.EVALUATED) {
			const offer = orderBy(await goat.children.matchMaker(son.id), p => p.ep.e1 + p.ep.e2 +p.ep.e3 +p.ep.e4, 'desc')
			if (offer.length) {
				try {
					await goat.children.marry(son.id, offer[0].sonuid, offer[0].fuid)
					logger.warn(`Married son ${son.id} to ${offer[0].fname} - ${offer[0].sonuid}`)
					son.state = CHILDREN_STATUS.MARRIED
				} catch (e) {
					logger.error(`Couldn't marry son ${son.id} because ${e.toString()}`)
				}
			} else {
				try {
					await goat.children.propose(son.id)
					son.state = CHILDREN_STATUS.FINDING_SPOUSE
				} catch (e) {
					logger.error(`Couldn't matchmake son ${son.id} because ${e.toString()}`)
				}
			}
		}
	}

	try {
		if (await goat.children.raiseAllSons())
			logger.success('Children raised')
	} catch (e) {
		logger.error(`[CHILDREN] ${e}`)
	}
}
