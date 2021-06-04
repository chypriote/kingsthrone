import { find } from 'lodash'
import { Expedition } from '~/types/goatGeneric'
import { goat } from '../services/requests'
import { logger } from '../services/logger'

const state = {
	expeditions: 0,
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

export const doExpeditions = async (count: number): Promise<void> => {
	try {
		await goat.merchantVentures(50)
		while (state.expeditions < count) {
			const multiple = await goat.multipleExpeditions(state.expeditions + 8)
			await goat.doExpedition(selectExpedition(multiple.data))
			const current = await goat.doExpedition(selectExpedition(multiple.data))
			state.expeditions = current.gid - 1
		}
	} catch (e) {
		logger.error('Error while doing expeditions & merchant ventures')
	}
}
