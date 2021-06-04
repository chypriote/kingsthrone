import { find, reduce } from 'lodash'
import { CastleInfos, EventInfo } from '~/types/goatGeneric'
import { goat, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'
import { Son } from '~/types/game'
import { differenceInMinutes, fromUnixTime } from 'date-fns'

let sons: Son[] = []

export const updateSonsAvailability = (quest: EventInfo, availability: boolean): void => {
	quest.son_slot.forEach(slot => {
		const son = find(sons, s => s.id === slot.sonId)
		if (son) {son.available = availability}
	})
}

//Quete ongoing: isCheck= 1 status= 0
//Quete finie claimed: isChecked= 1 status= 1

//Quete non commencée: isChecked= 0 status= 0
//Quete finie non claimed: isCheck= 0 status= 0 > check if starttime

export const manualQuesting = async (quests: EventInfo[], castle: number): Promise<boolean> => {
	let claimed = 0
	for (const quest of quests) {
		if (quest.startTime && differenceInMinutes(new Date(), fromUnixTime(quest.startTime)) < 30) { //en cours 10
			console.log(`Ongoing quest ${quest.eventId} since ${differenceInMinutes(new Date(), fromUnixTime(quest.startTime))}`)
			continue
		}

		if (!quest.isCheck && !quest.status && quest.startTime) { //terminée non claim 00
			await goat.claimQuest(quest.eventId, castle)
			updateSonsAvailability(quest, true)
			claimed++
			continue
		}

		if (!quest.isCheck && !quest.status) { //non commencée 00
			const available = sons.filter(s => s.available)
			if (!available.length) {continue}
			await goat.sendQuest(quest.eventId, castle, available[0].id)
			available[0].available = false
			continue
		}

		if (quest.isCheck && quest.status) { //terminée claim 11
			console.log(`Quest ${quest.eventId} finished`)
			claimed++
		}
	}

	return claimed === 3
}

export const handleCastle = async (castle: CastleInfos): Promise<void> => {
	logger.warn(`Handling castle ${castle.id}`)
	const castleInfos = await goat.getCastleRewards(castle.id)
	if (!castleInfos) {console.log('No rewards')} else {console.log('Claimed maiden rewards')}

	const quests = castle.task.event
	const status = reduce(quests, (sum, q) => sum + (q.isCheck && q.status ? 1 : 0) + (!q.isCheck && !q.status && q.startTime ? 1 : 0), 0)

	if (status === 6) { //toutes finies et claimed
		if (castle.task.refreshNum === 8) {console.log('No more refreshes'); return}
		const refresh = await goat.refreshQuests(castle.id)

		quests.forEach(event => {
			if (!event.son_slot.length) { return }
			updateSonsAvailability(event, true)
		})

		if (refresh) {castle.task.event = refresh.task.event}
	}

	const todo = await manualQuesting(quests, castle.id)

	if (todo) {
		logger.error(`Might want to redo castle ${castle.id}`)
	}
}

export const runAllQuests = async (): Promise<void> => {
	await goat.login(LOGIN_ACCOUNT_NAPOLEON)
	const goat = await goat.getGameInfos()
	// const status = goat.hangUpSystem
	const castles = goat.hangUpSystem.info
	sons = goat.son.sonList.map(son => ({ ...son, availableProcessions: true }))

	castles.forEach(castle => {
		castle.task.event.forEach(event => {
			updateSonsAvailability(event, false)
		})
	})

	for (const castle of castles) {
		await handleCastle(castle)
	}

	logger.success('Finished')
}

runAllQuests().then(() => process.exit())
