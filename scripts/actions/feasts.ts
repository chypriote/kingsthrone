import { find } from 'lodash'
import { goat, FeastShop, Seat } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { ITEMS } from 'kingsthrone-api/lib/types/Item'

const BOUGHT_ITEMS = [
	{ name: 'Manuscript Page', id: ITEMS.MANUSCRIPT_PAGE },
	// { name: 'Gold Dowry', id: 102 },
	// { name: 'Inspiration Tome IV', id: 44 },
	{ name: 'Fortune Tome IV', id: 24 },
	{ name: 'Military Tome IV', id: 14 },
	// { name: 'Provisions Tome IV', id: 34 },
	// { name: 'Superior Experience Pack', id: ITEMS.SUP_EXPERIENCE_PACK },
]

const selectSeat = async (fid: string): Promise<Seat|undefined> => {
	const feast = await goat.feasts.getFeast(fid)

	if (find(feast.list, (seat: Seat) => seat.uid == goat._getGid())) {return}

	return find(feast.list, (seat: Seat) => seat.type === 0)
}

const joinFeast = async (fid: string): Promise<boolean> => {
	const seat = await selectSeat(fid)
	if (!seat) {return false}
	await goat.feasts.joinFeast(fid, seat.id)
	logger.success(`attended feast ${fid}`)
	return true
}

const buyShop = async (shop: FeastShop): Promise<void> => {
	if (shop.score < 1000) { return }

	for (const offer of shop.list) {
		if (offer.buy) { continue }

		const toBuy = find(BOUGHT_ITEMS, it => it.id == offer.item.id)
		if (toBuy) {
			await goat.feasts.buyFeastItem(offer.id)
			logger.success(`Bought ${toBuy.name}`)
		}
	}
}

export const attendFeasts = async (): Promise<void> => {
	try {
		const data = await goat.feasts.getFeastsInfo()
		const feasts = data.yhshow
		let todo = data.jlfy.freeNum
		const ours = find(feasts, f => [6999005053, 699002934].includes(parseInt(f.uid)) && f.uid != goat._getGid())

		await buyShop(data.jlShop)
		//Join my feast if existing
		if (todo && ours && await joinFeast(ours.uid)) { todo-- }
		//Join random feasts if existing
		for (let i = 0; todo && i < feasts.length; i++) {
			if (await joinFeast(feasts[i].uid)) { todo-- }
		}

		try {
			await goat.feasts.openFeast()
			logger.success('Opened a small feast')
		} catch (e){/**/}
	} catch (e) {
		logger.error(`[FEASTS] ${e}`)
	}
}
