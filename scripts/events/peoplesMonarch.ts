import { find } from 'lodash'
import { goat } from 'kingsthrone-api'
import { PEOPLES_MONARCH_ITEM, PeoplesMonarchStatus } from 'kingsthrone-api/lib/types/Events'
import { logger } from '../services/logger'

const peoplesMonarchItemIds = {
	1: 271,
	2: 272,
	3: 273,
	4: 274,
}
let status: PeoplesMonarchStatus


const buyAll = async (item: PEOPLES_MONARCH_ITEM) => {
	const available = find(status.shop, s => s.items.id === peoplesMonarchItemIds[item])

	if (!available) { return}
	const bag = find(status.bag, b => b.id === peoplesMonarchItemIds[item]) || { id: peoplesMonarchItemIds[item], count: 0, kind: 11 }

	for (let i = 0; i < available.limit; i++) {
		await goat.events.peoplesMonarch.buyShopItem(item)
		bag.count++
	}
}
const useAll = async (item: PEOPLES_MONARCH_ITEM) => {
	const available = find(status.bag, b => b.id === peoplesMonarchItemIds[item])

	if (!available || !available.count) { return }
	for (let i = 0; i < available.count; i++) {
		await goat.events.peoplesMonarch.useItem(peoplesMonarchItemIds[item])
	}
}

export const peoplesMonarch = async (): Promise<void> => {
	status = await goat.events.peoplesMonarch.eventInfos()
	logger.log('---People\'s Monarch---')

	try {
		await buyAll(PEOPLES_MONARCH_ITEM.CAP)
		await useAll(PEOPLES_MONARCH_ITEM.CAP)
		await useAll(PEOPLES_MONARCH_ITEM.SWORD)
		await useAll(PEOPLES_MONARCH_ITEM.ROSE)
		await useAll(PEOPLES_MONARCH_ITEM.RING)
	} catch (e) {console.trace(e.toString())}
}
