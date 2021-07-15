import { GoatResource } from '../GoatResource'
import { FeastDetails, FeastInfo, FeastShop, FeastStatus, OngoingFeast } from '../../../types/goat/Feasts'

export class Feasts extends GoatResource {
	async getFeastsInfo(): Promise<FeastInfo> {
		const data = await this.request({ 'jiulou': { 'jlInfo': [] }, 'rsn': '3zhwezswfze' })
		return data.a.jiulou
	}

	async getFeast(uid: string | null): Promise<FeastDetails> {
		const data = await this.request({ 'jiulou': { 'yhGo': { 'fuid': uid } }, 'rsn': '2ylayqahmb' })
		return data.a.jiulou.yhInfo
	}

	async openFeast(): Promise<void> {
		await this.request({ 'jiulou': { 'yhHold': { 'type': 1, 'isPush': 1, 'isOpen': true } }, 'rsn': '8akriooeom' })
	}

	async joinFeast(uid: string, seat: number): Promise<{ jfly: FeastStatus, jlShop: FeastShop, yhInfo: OngoingFeast[] }> {
		const data = await this.request({
			'jiulou': { 'yhChi': { 'type': 3, 'xwid': seat, 'fuid': uid } },
			'rsn': '9rsnctrnrt',
		})

		const { jfly, jlShop, yhInfo } = data.a.jiulou
		return { jfly, jlShop, yhInfo }
	}

	async buyFeastItem(id: number): Promise<void> {
		await this.request({ 'jiulou': { 'shopChange': { id } }, 'rsn': '5wfvrfphye' })
	}
}
