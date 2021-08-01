import { filter, orderBy, reduce } from 'lodash'
import { goat } from 'kingsthrone-api'
import { QualitySkill } from 'kingsthrone-api/lib/types/Hero'
import { logger } from '../services/logger'

export const heroesTrial = async (): Promise<void> => {
	logger.log('---Heroes\'s Trial---')
	const event = await goat.events.heroesTrial.eventInfos()
	const todo = 20
	let current = event.info.bossId

	if (current > todo) { return }

	let freeUses = 10 - event.info.hasFreeNum
	let tutorsGift = event.info.buyNum
	const available = event.info.hasHero.map(h => h.id)
	const heroes = orderBy(
		((await goat.profile.getGameInfos()).hero.heroList)
			.map(h => ({ ...h, available: available.includes(h.id), quality: reduce(h.epskill, (q: number, skill: QualitySkill) => q + skill.zz, 0) })),
		'quality', 'desc'
	)

	while (current <= todo) {
		if (!freeUses && !tutorsGift) {
			console.log('Buying tutor\'s gift')
			await goat.events.heroesTrial.buyTutorsGift(1)
			tutorsGift++
		}

		const available = filter(heroes, h => h.available && h.quality > 250)
		//if free, we use a free hero, otherwise use best available or respawn top
		const selected = freeUses && available.length ? available[todo - current] :
			(available.length ? available[0] : heroes[0])
		console.log(`Fighting boss ${current} with hero ${selected.id}`)
		await goat.events.heroesTrial.selectHero(selected.id)
		const result = await goat.events.heroesTrial.fight(selected.id)

		selected.available = false
		if (result.fight.win === 1) { current++ }
		if (freeUses) { freeUses-- } else {tutorsGift--}
	}

	for (const reward of event.info.floorRwdStatus) {
		if (reward.status === 1) { return }
		await goat.events.heroesTrial.claimReward(reward.id)
	}
}
