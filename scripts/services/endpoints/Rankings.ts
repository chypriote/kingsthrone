import { GoatResource } from '../GoatResource'

export class Rankings extends GoatResource {
	async payHomageKP(): Promise<void> {
		await this.request({ 'rsn': '5jwryfwjhjy', 'ranking': { 'mobai': { 'type': 1 } } })
	}

	async payHomageCampaign(): Promise<void> {
		await this.request({ 'rsn': '3hfknpzerw', 'ranking': { 'mobai': { 'type': 2 } } })
	}

	async payHomageIntimacy(): Promise<void> {
		await this.request({ 'rsn': '4cmivgafxm', 'ranking': { 'mobai': { 'type': 3 } } })
	}
}
