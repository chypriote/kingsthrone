import { goat } from 'kingsthrone-api'
import { fromUnixTime, isFuture } from 'date-fns'
import { logger } from './services/logger'
import { allianceSiege } from './actions/siege'
import { coronation, giftOfTheFae, treasureHunt } from './events/index'

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

	let faeDone = false
	for (const event of events) {
		if (event.type === 17 && isFuture(fromUnixTime(event.eTime))) { await treasureHunt() }
		if (event.type === 1123 && event.id === 1123 && isFuture(fromUnixTime(event.eTime))) { await divining() }
		if (event.type === 7 && isFuture(fromUnixTime(event.eTime))) { await coronation() }
		if (event.type === 1299 && isFuture(fromUnixTime(event.eTime)) && !faeDone) {faeDone = true; await giftOfTheFae() }
	}
}
