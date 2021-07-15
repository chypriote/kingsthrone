import { GoatResource } from '../GoatResource'
import { ITourneyStatus, OpponentHero, Reward, ShopItem } from '../../../types/goat/Tourney'

export class Tourney extends GoatResource {
	async getTourneyInfos(): Promise<ITourneyStatus> {
		const data = await this.request({ 'yamen': { 'yamen': [] }, 'rsn': '1qtiuqurtia' })
		return data.a.yamen
	}

	async getTourneyAdok(): Promise<ITourneyStatus> {
		const data = await this.request({ 'user': { 'adok': { 'label': 'yamen' } }, 'rsn': '6swkbswywgg' })
		return data.a.warHorse
	}

	async startTourneyFight(): Promise<ITourneyStatus> {
		const data = await this.request({ 'yamen': { 'pizun': [] }, 'rsn': '3esphksnsn' })
		return data.a.yamen
	}

	async startTokenTourneyFight(): Promise<ITourneyStatus> {
		const data = await this.request({ 'yamen': { 'chushi': [] }, 'rsn': '3espeerwpw' })
		return data.a.yamen
	}

	async buyTourneyBoost(item: ShopItem): Promise<ITourneyStatus> {
		const data = await this.request({ 'yamen': { 'seladd': { id: item.id } }, 'rsn': '2ylqabmbqq' })
		return data.a.yamen
	}

	async fightHero(hero: OpponentHero): Promise<ITourneyStatus> {
		const data = await this.request({ 'yamen': { 'fight': { 'id': hero.id } }, 'rsn': '3zhwpzzrphn' })
		return data.a.yamen
	}

	async getReward(): Promise<Reward> {
		const data = await this.request({ 'yamen': { 'getrwd': [] }, 'rsn': '1tabuiiqwa' })
		return data.a.yamen.win.rwd
	}

	async challengeOpponent(uid: string, hid: number): Promise<ITourneyStatus> {
		const data = await this.request({ 'yamen': { 'zhuisha': { 'fuid': uid, 'hid': hid } }, 'rsn': '8mxoaeekoe' })
		return data.a.yamen
	}

	async getTourneyReward(id: number): Promise<boolean> {
		try {
			await this.request({ 'yamen': { 'getdilyrwd': { id } }, 'rsn': '5yawyvphhr' })
			return true
		} catch (e) {/*We want to ignore completely*/
		}
		return false
	}
}
