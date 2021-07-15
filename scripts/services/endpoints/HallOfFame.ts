import { GoatResource } from '../GoatResource'
import { HallOfFamer } from '../../../types/goat/HallOfFame'

export class HallOfFame extends GoatResource {
	async getHoFInfo(): Promise<HallOfFamer[]> {
		const data = await this.request({ 'rsn': '5jwryjrwjje', 'huanggong': { 'getNewInfo': [] } })

		return data.a.huanggong.Info
	}

	async getHoFTitle(): Promise<HallOfFamer[]> {
		const data = await this.request({ 'rsn': '3zhwezwzknw', 'huanggong': { 'getInfoByWid': { 'wid': 2 } } })

		return data.a.huanggong.widInfo
	}

	async payHomage(): Promise<void> {
		await this.request({ 'rsn': '6wguulyyyy', 'huanggong': { 'qingAn': { 'fuid': 699002934, 'chenghao': 2 } } })
	}

	async claimHomage(): Promise<void> {
		await this.request({ 'rsn': '4fxccxgmfm', 'chenghao': { 'wyrwd': [] } })
	}
}
