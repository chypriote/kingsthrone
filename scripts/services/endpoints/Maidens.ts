import { GoatResource } from '../GoatResource'
import { Wife } from '../../../types/game'
import { StaminaResult, VisitsStatus } from '../../../types/goat/Maidens'

export class Maidens extends GoatResource {
	async visitRandomMaiden(): Promise<Wife> {
		const visit = await this.request({ 'wife': { 'sjxo': [] }, 'rsn': '9rzrtbtsrs' })

		return visit.u.wife.wifeList[0]
	}

	async useStaminaDraught(num = 1): Promise<StaminaResult> {
		const items = await this.request({ 'wife': { 'weige': { num } }, 'rsn': '3zhwezreeef' })

		return {
			items: items.u.item.itemList[0],
			status: items.a.wife.jingLi,
		}
	}

	async getAvailableVisits(): Promise<VisitsStatus> {
		const next = await this.request({ 'user': { 'refwife': [] }, 'rsn': '9zrimzcbbis' })

		return next.a.wife.jingLi
	}
}
