import { GoatResource } from '../GoatResource'
import { PunishmentResult } from '~/types/goat/PunishmentResult'

export class Dungeon extends GoatResource {
	async punishPrisoner(): Promise<PunishmentResult> {
		const data = await this.request({ 'rsn': '9rsnniccct', 'laofang': { 'bianDa': { 'type': 1 } } })
		return data.a.laofang
	}
}
