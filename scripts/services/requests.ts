import axios from 'axios'
import { Club, Profile, KingdomRank, TourneyRank } from '~/types/goat'
import { logger } from '../services/logger'

const BASE_SERVER = '699'
const BASE_URL = (server = BASE_SERVER) => `http://zsjefunbm.zwformat.com/servers/s${server}.php`
const COOKIE = 'lyjxncc=2083c99339e8b46bf500d2d46ae68581'
const TOKEN = '7291545ad393b1ae47088f3713a2d881'

export class GoatRequest {
	cookie: string
	token: string|null = null
	server: string
	base_url: string

	isLoggedIn = false

	constructor(server = '699', cookie = COOKIE) {
		this.cookie = cookie
		this.server = server
		this.base_url = `http://zsjefunbm.zwformat.com/servers/s${server}.php`
	}

	setServer(server: string): this {
		this.server = server
		return this
	}

	private async login(): Promise<any> {
		const response = await axios.post(this.base_url, {
			'rsn':'4cfhvxxiim',
			'login':{
				'loginAccount':{
					'parm1':'WIFI',
					'platform':'gaotukc',
					'parm2':'GooglePlay',
					'parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f',
					'parm3':'SM-G955F',
					'openid':'563125632849524101',
					'openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706',
				},
			},
		}, {
			params: {
				sevid: this.server,
				ver: 'V1.3.497',
				uid: '',
				token: '',
				platform: 'gaotukc',
				lang: 'en',
			},
			headers: {
				'Accept-Encoding': 'identity',
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; SM-G955F Build/NRD90M)',
				'Host': 'zsjefunbm.zwformat.com',
				'Cookie': this.cookie,
				'Connection': 'Keep-Alive',
			},
		}).then(response => response.data)

		if (!response?.a?.loginMod?.loginAccount?.token) {
			logger.error(`LoginError: ${response?.a?.system?.errror.msg}`)
			process.exit()
		}

		this.token = response?.a?.loginMod?.loginAccount?.token
		this.isLoggedIn = true

		return response.a.loginMod.loginAccount
	}

	private async sendRequest(data: unknown): Promise<any> {
		if (!this.isLoggedIn) {await this.login()}

		const response =  await axios.post(BASE_URL(), data, {
			params: {
				sevid: this.server,
				ver: 'V1.3.497',
				uid: '699002934',
				token: this.token,
				platform: 'gaotukc',
				lang: 'en',
			},
			headers: {
				'Accept-Encoding': 'identity',
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; SM-G955F Build/NRD90M)',
				'Host': 'zsjefunbm.zwformat.com',
				'Cookie': this.cookie,
				'Connection': 'Keep-Alive',
			},
		}).then(response => response.data)

		if (response?.a?.system?.errror) {
			logger.error(`RequestError: ${response?.a?.system?.errror.msg}`)
			process.exit()
		}

		return response
	}

	async getProfile(gid: number): Promise<Profile>  {
		const profile = await this.sendRequest({ user: { getFuserMember: { id: gid } },rsn: '5ypfaywvff' })

		return profile.a.user.fuser
	}

	async getKingdomRankings(): Promise<KingdomRank[]> {
		const ladder = await this.sendRequest({ ranking:{ paihang:{ type:0 } }, rsn:'2ynxlnaqyx' })

		return ladder.a.ranking.shili
	}

	async getTourneyRankings(): Promise<TourneyRank[]> {
		const tourney = await this.sendRequest({ yamen:{ getrank:[] }, rsn:'8jaaovjikee' })

		return tourney.a.yamen.rank
	}

	async getAllianceLadder(): Promise<Club[]> {
		const alliances = await this.sendRequest({ club:{ clubList:[] },rsn:'3zhpsspfrse' })

		return alliances.a.club.clubList
	}
}

export const client = new GoatRequest()

const sendRequest = async (data: unknown): Promise<any> => {
	const response =  await axios.post(BASE_URL(), data, {
		params: {
			sevid: BASE_SERVER,
			ver: 'V1.3.497',
			uid: '699002934',
			token: TOKEN,
			platform: 'gaotukc',
			lang: 'en',
		},
		headers: {
			'Accept-Encoding': 'identity',
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; SM-G955F Build/NRD90M)',
			'Host': 'zsjefunbm.zwformat.com',
			'Cookie': COOKIE,
			'Connection': 'Keep-Alive',
		},
	}).then(response => response.data)

	if (response?.a?.system?.errror) {
		logger.error(`RequestError: ${response?.a?.system?.errror.msg}`)
		process.exit()
	}

	return response
}

export const getProfile = async (gid: number): Promise<Profile> => {
	const profile = await sendRequest({ user: { getFuserMember: { id: gid } },rsn: '5ypfaywvff' })

	return profile.a.user.fuser
}

export const getKingdomRankings = async (): Promise<KingdomRank[]> => {
	const ladder = await sendRequest({ ranking:{ paihang:{ type:0 } }, rsn:'2ynxlnaqyx' })

	return ladder.a.ranking.shili
}

export const getTourneyRankings = async (): Promise<TourneyRank[]> => {
	const tourney = await sendRequest({ yamen:{ getrank:[] }, rsn:'8jaaovjikee' })

	return tourney.a.yamen.rank
}

export const getAllianceLadder = async (): Promise<Club[]> => {
	const alliances = await sendRequest({ club:{ clubList:[] },rsn:'3zhpsspfrse' })

	return alliances.a.club.clubList
}
