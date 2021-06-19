import { find } from 'lodash'
import { goat } from '../services/requests'
import { logger } from '../services/logger'
import { FeastShop, Seat } from '~/types/goat/Feasts'

const BOUGHT_ITEMS = [
	{ name: 'Manuscript Page', id: 111 },
	{ name: 'Gold Dowry', id: 102 },
	{ name: 'Inspiration Tome IV', id: 44 },
	{ name: 'Fortune Tome IV', id: 24 },
	{ name: 'Military Tome IV', id: 14 },
	{ name: 'Provisions Tome IV', id: 34 },
	{ name: 'Superior Experience Pack', id: 78 },
]

const selectSeat = async (fid: string): Promise<Seat|undefined> => {
	const feast = await goat.getFeast(fid)

	if (find(feast.list, (seat: Seat) => seat.uid == goat.gid)) {return}

	return find(feast.list, (seat: Seat) => seat.type === 0)
}

const joinFeast = async (fid: string): Promise<boolean> => {
	const seat = await selectSeat(fid)
	if (!seat) {return false}
	await goat.joinFeast(fid, seat.id)
	logger.success(`attended feast ${fid}`)
	return true
}

const buyShop = async (shop: FeastShop): Promise<void> => {
	for (const offer of shop.list) {
		if (offer.buy) { continue }

		const toBuy = find(BOUGHT_ITEMS, it => it.id == offer.item.id)
		if (toBuy) {
			await goat.buyFeastItem(offer.id)
			logger.success(`Bought ${toBuy.name}`)
		}
	}
}

export const attendFeasts = async (): Promise<void> => {
	try {
		const data = await goat.getFeastsInfo()
		const feasts = data.yhshow
		let todo = data.jlfy.freeNum
		const ours = find(feasts, f => [6999005053, 699002934].includes(parseInt(f.uid)) && f.uid != goat.gid)

		await buyShop(data.jlShop)
		//Join my feast if existing
		if (todo && ours && await joinFeast(ours.uid)) { todo-- }
		//Join random feasts if existing
		for (let i = 0; todo && i < feasts.length; i++) {
			if (await joinFeast(feasts[i].uid)) { todo-- }
		}

		try {
			await goat.openFeast()
			logger.success('Opened a small feast')
		} catch (e){/**/}
	} catch (e) {
		logger.error(`[FEASTS] ${e}`)
	}
}
