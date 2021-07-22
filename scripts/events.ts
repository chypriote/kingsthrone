import { goat } from 'kingsthrone-api'
import { fromUnixTime, isFuture } from 'date-fns'
import { QUEST_STATUS, RWD_STATUS } from 'kingsthrone-api/lib/types/Events'
import { logger } from './services/logger'

const treasureHunt = async () => {
	const status = await goat.events.treasureHunt.eventInfos()
	logger.log('---Treasure Hunt---')

	let shovels = status.cons
	const quests = status.cfg.chutou.filter(q => q.has >= q.max && q.isGet === QUEST_STATUS.FINISHED)
	for (const quest of quests) {
		await goat.events.treasureHunt.claimShovel(quest.id)
		shovels++
		logger.log(`Claiming quest ${quest.msg}`)
	}

	for (let i = 0; i < shovels; i++) {
		await goat.events.treasureHunt.dig()
		logger.log('digging')
	}

	if (!shovels) { return }
	const updated = await goat.events.treasureHunt.eventInfos()
	for (const rwd of updated.cfg.rwd) {
		if (rwd.items.length && rwd.isGet === RWD_STATUS.READY) {
			await goat.events.treasureHunt.openChest(rwd.id)
			logger.log('Opened a chest')
		}
	}
}

export const doEvents = async () => {
	const events = (await goat.profile.getGameInfos()).huodonglist.all

	for (const event of events) {
		if (event.type === 17 && isFuture(fromUnixTime(event.eTime))) { await treasureHunt() }
	}
}
