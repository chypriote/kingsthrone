import { logger } from '../services/logger'
import { goat } from 'kingsthrone-api'
import { find } from 'lodash'

export const alliancePurchase = async (): Promise<void> => {
	logger.log('---Alliance Purchase---')
	const status = await goat.events.alliancePurchase.eventInfos()
	const today = status.user.today

	const day = find(status.cfg, i => i.day === today)
	const ally = find(status.clubczinfo, i => i.day === today)
	const rwd = find(status.user.rwd, i => i.day === today)
	const claimed: number[] = []
	if (rwd) { rwd.list.forEach(it => claimed.push(it.id)) }

	if (!day || !ally) { return }

	for (const list of day.list) {
		if (list.need > ally.num || claimed.includes(list.id)) {continue}
		await goat.events.alliancePurchase.claimReward(today, list.id)
		logger.success(`Claimed reward ${list.id} for day ${today}`)
	}
}
