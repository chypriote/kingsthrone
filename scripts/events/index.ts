import { goat, Event as GoatEvent } from 'kingsthrone-api'
import { fromUnixTime, isFuture } from 'date-fns'
import { logger } from '../services/logger'
import { allianceSiege } from '../actions/siege'
import { treasureHunt } from './treasureHunt'
import { coronation } from './coronation'
import { giftOfTheFae } from './giftOfTheFae'
import { pathOfWealth } from './pathOfWealth'
import { renownedMerchant } from './renownedMerchant'
import { handlePass, PASS_TYPE } from './pass'
import { peoplesMonarch } from './peoplesMonarch'
import { alchemy } from './alchemy'
import { LTQ_TYPES, LTQStatus } from 'kingsthrone-api/lib/types/LimitedTimeQuests'
import { slice } from 'lodash'

const divining = async () => {
	const status = await goat.events.divining.eventInfos()
	logger.log('---Divining---')
	if (!status.info.starSign) {
		await goat.events.divining.selectStarSign()
	}

	const stargaze = status.info.surplusFreeNum
	for (let i = 0; i < stargaze; i++) {
		await goat.events.divining.stargaze()
		logger.log('stargazing')
	}
}
const LIMITED_QUESTS = [
	LTQ_TYPES.SPEND_GEMS,
	LTQ_TYPES.LOSE_SOLDIERS,
	LTQ_TYPES.SPEND_GOLD,
	LTQ_TYPES.STUDY_MANUSCRIPTS,
	LTQ_TYPES.INCREASE_POWER,
	LTQ_TYPES.ENACT_DECREES,
	LTQ_TYPES.LOGIN,
	LTQ_TYPES.TOURNEY_SCORE,
	LTQ_TYPES.ARRANGE_MARRIAGES,
	LTQ_TYPES.ENERGY_DRAUGHT,
	LTQ_TYPES.RANDOM_VISITS,
]
const getQuestInfos = async (type: number): Promise<LTQStatus|null> => {
	switch (type) {
	case LTQ_TYPES.SPEND_GEMS: return await goat.limitedTimeQuests.spendGems()
	case LTQ_TYPES.LOSE_SOLDIERS: return await goat.limitedTimeQuests.loseSoldiers()
	case LTQ_TYPES.SPEND_GOLD: return await goat.limitedTimeQuests.spendGold()
	case LTQ_TYPES.STUDY_MANUSCRIPTS: return await goat.limitedTimeQuests.studyManuscripts()
	case LTQ_TYPES.INCREASE_POWER: return await goat.limitedTimeQuests.increaseKP()
	case LTQ_TYPES.ENACT_DECREES: return await goat.limitedTimeQuests.enactDecrees()
	case LTQ_TYPES.LOGIN: return await goat.limitedTimeQuests.login()
	case LTQ_TYPES.TOURNEY_SCORE: return await goat.limitedTimeQuests.tourneyScore()
	case LTQ_TYPES.ARRANGE_MARRIAGES: return await goat.limitedTimeQuests.arrangeMarriages()
	case LTQ_TYPES.ENERGY_DRAUGHT: return await goat.limitedTimeQuests.energyDraughtQuest()
	case LTQ_TYPES.RANDOM_VISITS: return await goat.limitedTimeQuests.randomVisitsQuest()
	default: return null
	}
}
const doLimitedQuests = async (event: GoatEvent) => {
	const status = await getQuestInfos(event.id)
	if (!status) { return }

	const rewards = slice(status.cfg.rwd, status.rwd)
	for (const reward of rewards) {
		if (status.cons < reward.need) {break}
		await goat.limitedTimeQuests.claimRewards(event.id)
		console.log(`Claimed reward for limited quest ${event.id}`)
	}
}

export const doEvents = async (): Promise<void> => {
	const status = await goat.profile.getGameInfos()
	const events = status.huodonglist.all

	if (status.kuaCLubBattle && status.kuaCLubBattle.data.type !== 0) {
		await allianceSiege()
	}

	let merchantDone = false
	for (const event of events) {
		if (!isFuture(fromUnixTime(event.eTime))) { continue }
		if (event.type === 17) { await treasureHunt() }
		if (event.type === 1123 && event.id === 1123) { await divining() }
		if (event.type === 7 && event.id === 280) { await coronation() }
		if (event.type === 7 && event.id === 282) { await peoplesMonarch() }
		if (event.id === 1299) {await giftOfTheFae() }
		if (event.id === 293) {await pathOfWealth() }
		if (event.type === 1231 && !merchantDone) {merchantDone = true; await renownedMerchant() }
		if (event.id === 1241) {await handlePass(PASS_TYPE.VENETIAN_PASS) }
		if (event.id === 1086) {await handlePass(PASS_TYPE.KINGS_PASS) }
		//New heroesTrial is too difficult to automate
		// if (event.id === 1083) {await heroesTrial() }
		if (event.id === 1092) {await alchemy() }
		if (LIMITED_QUESTS.includes(event.id) && event.type === 2) { await doLimitedQuests(event)}
	}
}
