import { GoatResource } from '../../GoatResource'

export class TreasureHunt extends GoatResource {
	async eventInfos(): Promise<TreasureHunt> {
		const data = await this.request({ 'huodong': { 'hd296Info': [] }, 'rsn': '2myqxxhaxab' })
		return data.a.wbhuodong.wabao
	}

	async claimShovels(): Promise<void> {
		for (let i = 1; i < 15; i++) {
			await this.request({ 'huodong': { 'hd296Task': { 'id': i } }, 'rsn': '5wpwwyhwhf' })
		}
	}

	async dig(): Promise<void> {
		await this.request({ 'huodong': { 'hd296Wa': [] }, 'rsn': '5wpwwyhjyy' })
	}
}
