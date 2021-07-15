import { GoatResource } from '../../GoatResource'
import { XSOngoingFight } from '../../../../types/goat/TourneyXS'
import { OpponentHero, Reward, ShopItem } from '../../../../types/goat/Tourney'

export class XServerTourney extends GoatResource {
	async xsGetTourneyInfos(): Promise<XSOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'yamen': [] }, 'rsn': '2malnlahyqq' })
		return data.a.kuayamen
	}

	async xsStartTourneyFight(): Promise<XSOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'pizun': [] }, 'rsn': '3esphksnsn' })
		return data.a.kuayamen
	}

	async xsStartTokenTourneyFight(): Promise<XSOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'chushi': [] }, 'rsn': '3espeerwpw' })
		return data.a.kuayamen
	}

	async xsBuyTourneyBoost(item: ShopItem): Promise<XSOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'seladd': { 'id': item.id } }, 'rsn': '5wfrarhwer' })
		return data.a.kuayamen
	}

	async xsFightHero(hero: OpponentHero): Promise<XSOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'fight': { 'id': hero.id } }, 'rsn': '6wgklkbxkx' })
		return data.a.kuayamen
	}

	async xsGetReward(): Promise<Reward> {
		const data = await this.request({ 'kuayamen': { 'getrwd': [] }, 'rsn': '2axhlhqxbh' })
		return data.a.kuayamen.win.rwd
	}

	async xsChallengeOpponent(uid: string, hid: number): Promise<XSOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'zhuisha': { 'fuid': uid, 'hid': hid } }, 'rsn': '5yavaehwer' })
		return data.a.kuayamen
	}

	async xsGetTourneyReward(id: number): Promise<boolean> {
		try {
			await this.request({ 'yamen': { 'getdilyrwd': { id } }, 'rsn': '5yawyvphhr' })
			return true
		} catch (e) {/*We want to ignore completely*/
		}
		return false
	}
}
