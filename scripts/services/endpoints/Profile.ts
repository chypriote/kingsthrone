import { GoatResource } from '../GoatResource'
import { DECREE_TYPE } from '../../actions/misc'
import { GameInfos } from '../../../types/game'
import { CouncilStatus } from '~/types/goat/CouncilStatus'
import { UserProfile } from '~/types/goat/User'

export class Profile extends GoatResource {
	async getGameInfos(): Promise<GameInfos> {
		const game = await this.request({
			rsn: '2ynbmhanlb',
			guide: { login: { language: 1, platform: 'gaotukc', ug: '' } },
		})
		return game.a
	}

	async getAllLevies(): Promise<boolean> {
		try {
			await this.request({ 'user': { 'jingYingAll': [] }, 'rsn': '1tabbiiurr' })
		} catch (e) {
			return false
		}
		return true
	}
	async getAllDecreesResources(type: DECREE_TYPE): Promise<boolean> {
		try {
			await this.request({ 'user': { 'yjZhengWu': { 'act': type } }, 'rsn': '1tabbiitbi' })
		} catch (e) {
			return false
		}
		return true
	}

	async finishTraining(): Promise<boolean> {
		try {
			await this.request({ 'rsn': '9zrimzjntjm', 'school': { 'allover': [] } })
		} catch (e) {
			return false
		}
		return true
	}
	async startTraining(): Promise<void> {
		await this.request({ 'rsn': '6wguulskgy', 'school': { 'allstart': [] } })
	}

	async visitCouncil(): Promise<CouncilStatus> {
		const data = await this.request({ 'rsn': '4fcgffigihv', 'hanlin': { 'comein': { 'fuid': this._goat._getGid() } } })
		return data.a.hanlin
	}
	async hostCouncil(num = 3): Promise<void> {
		await this.request({ 'rsn': '3eseehnzfw', 'hanlin': { 'opendesk': { num, 'isPush': 1 } } })
	}

	async getUser(gid: string): Promise<UserProfile|null>  {
		const profile = await this.request({ user: { getFuserMember: { id: gid } }, rsn: '1taquiwekk' })

		if (profile?.a?.system?.errror) {
			return null
		}

		return profile.a.user.fuser
	}
}
