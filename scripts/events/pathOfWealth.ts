import { goat } from 'kingsthrone-api'
import { QUEST_STATUS, RWD_STATUS } from 'kingsthrone-api/lib/types/Events'
import { logger } from '../services/logger'

export const pathOfWealth = async (): Promise<void> => {
	const status = await goat.events.pathOfWealth.eventInfos()
	logger.log('---Path of Wealth---')

	let dices = status.run.num
	const quests = status.xunbao.cfg.touzi.filter(q => q.has >= q.max && q.isGet === QUEST_STATUS.FINISHED)
	for (const quest of quests) {
		await goat.events.pathOfWealth.claimDice(quest.id)
		dices++
		logger.log(`Claiming quest ${quest.msg}`)
	}

	for (let i = 0; i < dices; i++) {
		await goat.events.pathOfWealth.rollDice()
		logger.log('throwing dice')
	}

	if (!dices) { return }
	const updated = await goat.events.pathOfWealth.eventInfos()
	for (const rwd of updated.xunbao.cfg.rwd) {
		if (rwd.items.length && rwd.isGet === RWD_STATUS.READY) {
			await goat.events.pathOfWealth.openChest(rwd.id)
			logger.log('Opened a chest')
		}
	}
}
