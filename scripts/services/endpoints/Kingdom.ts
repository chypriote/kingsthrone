import { CastleInfos } from '../../../types/goat/Kingdom'
import { GoatResource } from '../GoatResource'
import { logger } from '../logger'

export class Kingdom extends GoatResource {
	async getCastleRewards(id: number, rsn: string): Promise<CastleInfos | false> {
		try {
			const reward = await this.request({ 'rsn': rsn, 'hangUpSystem': { 'getRewards': { 'type': 'all', 'id': id } } })
			return reward.u.hangUpSystem.info[0]
		} catch (e) {
			return false
		}
	}

	async getChapterRwdList(): Promise<void> {
		return await this.request({ 'user': { 'getChapterRwdList': [] }, 'rsn': '9zriizmmnmt' })
	}

	async claimAll(castleId: number): Promise<void> {
		try {
			await this.request({
				'rsn': '4acfahcffvm',
				'hangUpSystem': { 'getSonDispatchRewards': { 'eventId': 'all', 'id': castleId } },
			})
		} catch (e) {
			logger.error(`Failed at claimAll ${e.toString()}`)
		}
	}

	async claimQuest(eventId: string, castleId: number): Promise<void> {
		try {
			await this.request({
				'rsn': '9zrmzjtbsjm',
				'hangUpSystem': { 'getSonDispatchRewards': { 'eventId': eventId, 'id': castleId } },
			})
		} catch (e) {
			logger.error(`Failed at claimQuest ${e.toString()}`)
		}
	}

	async sendQuest(eventId: string, castleId: number, sons: number[]): Promise<void> {
		try {
			const sonsSlots: { slot: number, sonId: number }[] = []
			sons.forEach((sonId, index) => sonsSlots.push({ slot: index + 1, sonId: sonId }))

			await this.request({
				'rsn': '9rztbmjirc', 'hangUpSystem': {
					'sonDispatch': {
						'son_slot': sonsSlots,
						'isDouble': 0,
						'eventId': eventId,
						'id': castleId,
					},
				},
			})
		} catch (e) {
			logger.error(`Failed at sendQuest ${e.toString()}`)
		}
	}

	async refreshQuests(castleId: number): Promise<CastleInfos | false> {
		try {
			const refresh = await this.request({
				'rsn': '3hzpseshen',
				'hangUpSystem': { 'refreshEvent': { 'type': 0, 'id': castleId } },
			})
			return refresh.u.hangUpSystem.info[0]
		} catch (e) {
			logger.error(`Failed at refreshQuests ${e.toString()}`)
			return false
		}
	}
}
