import { GoatResource } from '../../GoatResource'
import { EventRank } from '../../../../types/goat/events/Event'

export class DarkCastle extends GoatResource {
	async eventInfos(): Promise<DarkCastle> {
		const data = await this.request({ 'huodong': { 'hd1020Info': [] }, 'rsn': '1tbkeuueik' })
		return data.a.wshuodong
	}

	async getRanking(): Promise<EventRank[]> {
		const data = await this.request({ 'huodong': { 'hd1020Rank': [] }, 'rsn': '4cifhgiicf' })
		return data.a.wshuodong.wslist
	}
}
