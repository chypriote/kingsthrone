import { find } from 'lodash'
import { goat } from '../services/goat'
import { logger } from '../services/logger'
import { Expedition, ExpeditionInfo } from '~/types/goat/Expeditions'

const state: ExpeditionInfo = {
	gid: 0,
	heishu: 0,
	data: [],
}
const updateState = (status: ExpeditionInfo) => {
	state.gid = status.gid
	state.data = status.data
	state.heishu = status.heishu
}

const selectExpedition = (expeditions: Expedition[]): number => {
	let select = expeditions[0]
	for (const expedition of expeditions) {
		const manus = find(expedition.rwd, rwd => rwd.id === 77) //manuscript
		if (manus) return expedition.id

		select = select.army > expedition.army ? expedition : select
	}

	return select.id
}

export const doMerchant = async (count: number): Promise<void> => {
	try {
		const current = (await goat.expeditions.getMerchantStatus()).gid - 1
		await goat.expeditions.doMerchantVentures(count - current)
	} catch (e) {
		logger.log(e)
		logger.error('Error while doing merchant ventures')
	}
}
export const doExpedition = async (count: number): Promise<void> => {
	try {
		updateState(await goat.expeditions.getExpeditionsStatus())

		while (state.gid < count + 1) {
			if (state.gid % 10 === 0 || state.gid % 10 === 9) {
				updateState(await goat.expeditions.doExpedition(selectExpedition(state.data)))
				continue
			}
			updateState(await goat.expeditions.doExpeditions(state.gid - (state.gid % 10) + 8))
		}
	} catch (e) {
		logger.log(e)
		logger.error('Error while doing expeditions')
	}
}
