import { goat } from 'kingsthrone-api'
import { QUEST_STATUS, RWD_STATUS, TreasureHuntStatus } from 'kingsthrone-api/lib/types/Events'
import { logger } from '../services/logger'

const handleQuests = async (status: TreasureHuntStatus): Promise<number> => {
	let shovels = status.cons
	const quests = status.cfg.chutou.filter(q => q.has >= q.max && q.isGet === QUEST_STATUS.FINISHED)
	for (const quest of quests) {
		await goat.events.treasureHunt.claimShovel(quest.id)
		shovels += quest.items.count
		logger.log(`Claiming quest ${quest.msg}`)
	}

	return shovels
}

const dig = async (todo: number): Promise<void> => {
	try {
		for (let i = 0; i < todo; i++) {
			await goat.events.treasureHunt.dig()
			logger.log('digging')
		}
	} catch (e) {
		logger.error(`Failed digging because ${e.toString()}`)
	}
}

const openChests = async (): Promise<void> => {
	const updated = await goat.events.treasureHunt.eventInfos()
	for (const rwd of updated.cfg.rwd) {
		if (rwd.items.length && rwd.isGet === RWD_STATUS.READY) {
			await goat.events.treasureHunt.openChest(rwd.id)
			logger.log('Opened a chest')
		}
	}
}

export const treasureHunt = async (): Promise<void> => {
	const status = await goat.events.treasureHunt.eventInfos()
	logger.log('---Treasure Hunt---')

	const shovels = await handleQuests(status)
	await dig(shovels)
	await openChests()
}
