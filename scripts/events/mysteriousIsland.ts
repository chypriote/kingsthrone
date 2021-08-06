import { goat, Hero } from 'kingsthrone-api'
import { orderBy } from 'lodash'
import { logger } from '../services/logger'
import { MysteriousIslandStatus } from 'kingsthrone-api/lib/types/Events'

const selectFloor = async (id: number): Promise<number> => {
	let floor = parseInt(id.toString().replace(/.$/,'0'))
	let wrong = true
	let status: MysteriousIslandStatus|null = null
	while (wrong) {
		try {
			status = await goat.events.mysteriousIsland.selectIsland(floor)
			wrong = false
		} catch (e) {
			wrong = true
			floor++
		}
	}

	return status?.info.floorIndex || 0
}

export const mysteriousIsland = async (): Promise<void> => {
	logger.log('---Mysterious Island---')
	const heroes = (await goat.profile.getGameInfos()).hero.heroList
	const event = await goat.events.mysteriousIsland.eventInfos()
	const dead = event.info.hasHero.map(h => h.heroId)
	const available = orderBy(
		heroes.filter((h: Hero) => !dead.includes(h.id.toString())),
		'zfight_num',
		'desc'
	)
	let hero = available[0]
	let i = 0
	let floor = event.info.floorIndex ? //current floor selected
		event.info.floorIndex :
		(event.info.floorLog.length ? event.info.floorLog[event.info.floorLog.length - 1].floorIndex + 10000 : 10003)
	let status = event.info.floorIndex

	while (floor < 1010000) {
		if (status === 0) {
			status = await selectFloor(floor)
		}

		let win = 0
		while (status !== 0 && win !== 1) {
			await goat.events.mysteriousIsland.selectHero(hero.id)
			const fight = await goat.events.mysteriousIsland.fight(hero.id)
			logger.log(`Fight with ${hero.id} on level ${floor}`)
			win = fight.fight.win
			if (!fight.fight.win) { i++; hero = available[i] }
		}

		if (floor % 100000 < 1000) { //if we beat top floor
			logger.success(`Claiming reward for level ${Math.round(floor / 100000)}`)
			await goat.events.mysteriousIsland.getLevelReward(Math.round(floor / 100000))
		}
		floor += 10000
		status = 0
	}
}
