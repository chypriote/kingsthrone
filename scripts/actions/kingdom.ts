import { find, orderBy } from 'lodash'
import { differenceInMinutes, fromUnixTime } from 'date-fns'
import { goat, CastleInfos, EventInfo, Son } from 'kingsthrone-api'
import { Progress } from '../services/progress'
import { logger } from '../services/logger'

const requiredSons = (rarity: number) => {
	switch (rarity) {
	case 1: return 1
	case 2: return 2 //1 star 2 star
	case 3: //2star 3 star 4 star
	case 4: //3star 4star 5star
		return 3
	case 5: //3star 4star 5star 6star
	case 6:
		return 4
	}
	console.log(rarity)
	return 0
}

const updateSonsAvailability = (quest: EventInfo, status: boolean): void => {
	quest.son_slot.forEach((slot: { slot: number, sonId: number }) => {
		const son = find(state.sons, s => s.id === slot.sonId)
		if (son) {son.available = status}
	})
}

const findAvailableSon = (honor: number|null = null): Son|null => {
	const available = state.sons.filter(s => s.available && (honor ? s.honor === honor : true))
	if (!available.length) { return null }

	available[available.length - 1].available = false
	return available[available.length - 1]
}

const handleQuest = async (quest: EventInfo, castle: number): Promise<number> => {
	if (quest.startTime && differenceInMinutes(new Date(), fromUnixTime(quest.startTime)) < (30 * quest.rarity)) { //en cours 10
		// logger.log(`Ongoing quest ${quest.eventId} since ${differenceInMinutes(new Date(), fromUnixTime(quest.startTime))}mn`)
		return 0
	}

	if (
		(!quest.isCheck && !quest.status && quest.startTime)
		|| (quest.isCheck && !quest.status)
	) { //terminée non claim 00
		await goat.kingdom.claimQuest(quest.eventId, castle)
		// logger.log(`Claim quest ${quest.eventId} for castle ${castle}`)
		updateSonsAvailability(quest, true)
		return 1
	}

	if (!quest.isCheck && !quest.status) { //non commencée 00
		const sons = []
		for (let i = 0; i < requiredSons(quest.rarity); i++) {
			const son = findAvailableSon()
			if (!son) { return 0 }
			sons.push(son.id)
		}
		await goat.kingdom.sendQuest(quest.eventId, castle, sons)
		return 0
	}
	if ((quest.isCheck && quest.status) || (!quest.isCheck && quest.status)) { //terminée claim 11
		// logger.log(`Quest ${quest.eventId} finished`)
		return 1
	}

	console.log('bizarre', quest)
	return 0
}

export const handleCastle = async (castle: CastleInfos): Promise<void> => {
	// logger.warn(`Handling castle ${castle.id}`)
	await goat.kingdom.getCastleRewards(castle.id)
	// logger.log(`Claimed maiden rewards for cast ${casle.id}`)
	await goat.kingdom.levelUpCastle(castle.id)

	let status = 0
	const quests = castle.task.event
	for (const quest of quests) {
		status += await handleQuest(quest, castle.id)
	}
	if (status !== castle.task.event.length) { //if all quests are not finished & claimed
		return
	}

	if (castle.task.refreshNum === 8) { //all refreshes used
		// logger.warn('No more refreshes')
		return
	}

	// logger.log(`Refreshing quests for castle ${castle.id}`)
	const refresh = await goat.kingdom.refreshQuests(castle.id)
	if (refresh) {castle.task.event = refresh.task.event}
	for (const quest of castle.task.event) {
		await handleQuest(quest, castle.id)
	}
}

interface IState {
	sons: Son[],
	castles: CastleInfos[],
}
const state: IState = {
	sons: [],
	castles: [],
}

export const doKingdom = async (): Promise<void> => {
	try {
		const game = await goat.profile.getGameInfos()
		state.sons = orderBy(game.son.sonList.map((son: Son) => ({ ...son, available: true })), 'hono', 'asc')
		state.castles = game.hangUpSystem.info

		const progress = new Progress('Kingdom Exploration', state.castles.length, 'castles')

		//Setup available or not sons
		state.castles.forEach((castle: CastleInfos) => {
			castle.task.event.forEach((event: EventInfo) => {
				updateSonsAvailability(event, false)
			})
		})

		for (const castle of state.castles) {
			await handleCastle(castle)
			progress.increment()
		}
		progress.stop()
	} catch (e) {
		logger.error(e)
	}
}
