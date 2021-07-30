import { goat } from 'kingsthrone-api'
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
import { heroesTrial } from './heroesTrial'

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
		if (event.id === 1083) {await heroesTrial() }
	}
}
