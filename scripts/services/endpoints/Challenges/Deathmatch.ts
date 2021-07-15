import { GoatResource } from '../../GoatResource'
import { DMOngoingFight, DMRanking } from '../../../../types/goat/TourneyDM'
import { OpponentHero, Reward, ShopItem } from '../../../../types/goat/Tourney'

export class Deathmatch extends GoatResource {
	async dmGetTourneyInfos(): Promise<DMOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'jdComeHd': [] }, 'rsn': '3esswfnhew' })
		return data.a.jdyamen
	}

	async dmStartTourneyFight(): Promise<DMOngoingFight> {
		await this.request({ 'kuayamen': { 'jdSjtz': [] }, 'rsn': '1qtwwrwewku' })
		const data = await this.request({ 'kuayamen': { 'jdPiZhun': [] }, 'rsn': '6xllkgklyg' })
		return data.a.jdyamen
	}

	async dmStartTokenTourneyFight(): Promise<DMOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'jdChushi': [] }, 'rsn': '4cmxxihghg' })
		return data.a.jdyamen
	}

	async dmBuyTourneyBoost(item: ShopItem): Promise<DMOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'jdSeladd': { 'id': item.id } }, 'rsn': '7yddpollxv' })
		return data.a.jdyamen
	}

	async dmFightHero(hero: OpponentHero): Promise<DMOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'jdFight': { 'id': hero.id } }, 'rsn': '2yllhnqywb' })
		return data.a.jdyamen
	}

	async dmGetReward(): Promise<Reward> {
		const data = await this.request({ 'kuayamen': { 'jdGetrwd': [] }, 'rsn': '5wfaaypfer' })
		return data.a.jdyamen.win.rwd
	}

	async dmChallengeOpponent(uid: string, hid: number): Promise<DMOngoingFight> {
		const data = await this.request({ 'kuayamen': { 'jdZhuiSha': { 'fuid': uid, 'hid': hid } }, 'rsn': '7xcddslcgvg' })
		return data.a.jdyamen
	}

	async dmGetRankings(): Promise<DMRanking> {
		const data = await this.request({ 'kuayamen': { 'jdGetRank': { 'type': 1 } }, 'rsn': '3zeppnfzhse' })
		return data.a.jdyamen
	}
}
