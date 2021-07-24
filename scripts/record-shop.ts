import { goat, Item } from 'kingsthrone-api'
import { client } from './services/database'
import { fromUnixTime } from 'date-fns'
import { Shop } from '~/types/strapi/Shop'
import { groupBy, reduce } from 'lodash'


export const getShopByNameAndId = async (shop_id: number, name: string): Promise<Shop|null> => {
	const packs = await client('shop_packs')
		.where({ shop_id, name })
		.limit(1)

	return packs.length ? packs[0] : null
}

const logShop = async () => {
	const shop = (await goat.profile.getGameInfos()).shop.giftlist

	for (const pack of shop.list) {
		const existing = await getShopByNameAndId(shop.cft.id, pack.name)
		if (existing) { continue }

		const [packId] = await client('shop_packs').insert({
			name: pack.name,
			price: pack.price,
			vip: pack.vip,
			limit: pack.limit,
			from: fromUnixTime(shop.cft.sTime),
			to: fromUnixTime(shop.cft.eTime),
			shop_id: shop.cft.id,
		}).returning('id')

		const groups = groupBy(pack.items, 'id')
		for (const items of Object.values(groups)) {

			await client('shop_pack_items').insert({
				count: reduce(items, (count, it: Item) => count + it.count, 0),
				shop_pack: packId,
				item: items[0].id,
			})
		}
	}
}

logShop().then(() => {process.exit()})
