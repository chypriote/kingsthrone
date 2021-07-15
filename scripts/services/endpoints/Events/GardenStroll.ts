import { GoatResource } from '../../GoatResource'
import { EventRankWithServer } from '../../../../types/goat/events/Event'
import { GardenStrollPointExchange } from '../../../../types/goat/events/GardenStroll'

export class GardenStroll extends GoatResource {
	async eventInfos(): Promise<GardenStroll> {
		const data = await this.request({ 'huodong': { 'hd336Info': [] }, 'rsn': '8jmaoekjmvm' })
		return data.a.xjhuodong.xijiao
	}

	async getRanking(): Promise<EventRankWithServer[]> {
		const data = await this.request({ 'huodong': { 'hd336KuaRank': [] }, 'rsn': '2yaqnxywnqx' })
		return data.a.xjhuodong.xjkualist
	}

	async getShop(): Promise<GardenStrollPointExchange> {
		const data = await this.request({ 'huodong': { 'hd336KuaRank': [] }, 'rsn': '2yaqnxywnqx' })
		return data.u.xjhuodong.xijiao
	}
}
