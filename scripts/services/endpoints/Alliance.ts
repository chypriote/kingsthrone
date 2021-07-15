import { GoatResource } from '../GoatResource'
import { AllianceBossInfo } from '../../../types/goatGeneric'
import { FIGHT_STATUS } from '../../actions/worldboss'
import { ClubInfo } from '~/types/goat/Club'

export class Alliance extends GoatResource {
	async contributeAlliance(): Promise<boolean> {
		try {
			await this.request({ 'club': { 'dayGongXian': { 'dcid': 5 } }, 'rsn': '3hfkksnwfn' })
		} catch (e) {
			return false
		}
		return true
	}

	async getAllianceBossInfo(): Promise<AllianceBossInfo[]> {
		const data = await this.request({ 'club': { 'clubBossInfo': [] }, 'rsn': '5wfppaeavy' })

		return data.a.club.bossInfo
	}

	async fightAllianceBoss(boss: number, hero: number): Promise<FIGHT_STATUS> {
		try {
			await this.request({ 'club': { 'clubBossPK': { 'cbid': boss, 'id': hero } }, 'rsn': '4acbfaxfaxf' })
		} catch (e) {
			const msg = e.toString()
			if (msg === 'Error: The battle has ended') {
				return FIGHT_STATUS.BATTLE_ENDED
			}
			if (msg === 'Error: The hero is resting') {
				return FIGHT_STATUS.HERO_RESTING
			}
			if (msg === 'Error: The boss has been killed') {
				return FIGHT_STATUS.BOSS_KILLED
			}
			console.log(e)
		}
		return FIGHT_STATUS.ONGOING
	}
	async getLadder(): Promise<ClubInfo[]> {
		const alliances = await this.request({ club:{ clubList:[] }, rsn:'3zhpsspfrse' })
		return alliances.a.club.clubList
	}
}
