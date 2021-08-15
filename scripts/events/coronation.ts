import { find } from 'lodash'
import { goat } from 'kingsthrone-api'
import { CORONATION_ITEM, CoronationStatus } from 'kingsthrone-api/lib/types/Events'
import { logger } from '../services/logger'

const coronationItemIds = {
	1: 256,
	2: 257,
	3: 258,
	4: 259,
}
let status: CoronationStatus


const buyAll = async (item: CORONATION_ITEM) => {
	const available = find(status.shop, s => s.items.id === coronationItemIds[item])

	if (!available) { return}
	const bag = find(status.bag, b => b.id === coronationItemIds[item]) || { id: coronationItemIds[item], count: 0, kind: 11 }

	for (let i = 0; i < available.limit; i++) {
		await goat.events.coronation.buyShopItem(item)
		bag.count++
	}
}
const useAll = async (item: CORONATION_ITEM) => {
	const available = find(status.bag, b => b.id === coronationItemIds[item])

	if (!available || !available.count) { return }
	for (let i = 0; i < available.count; i++) {
		await goat.events.coronation.useItem(coronationItemIds[item])
	}
}

export const coronation = async (): Promise<void> => {
	status = await goat.events.coronation.eventInfos()
	logger.log('---Coronation---')

	await buyAll(CORONATION_ITEM.BANNER)
	await useAll(CORONATION_ITEM.BANNER)
	await useAll(CORONATION_ITEM.TRUMPET)
	await useAll(CORONATION_ITEM.DRUMS)
	await useAll(CORONATION_ITEM.CROWN)
}
