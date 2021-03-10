import axios from 'axios'
import { Club, Profile, KingdomRank, TourneyRank, EventRank } from '~/types/goat'
import { logger } from '../services/logger'
import { GameInfos } from '~/types/game'

const COOKIE = 'lyjxncc=2083c99339e8b46bf500d2d46ae68581'
const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'4cfhvxxiim','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f','parm3':'SM-G955F','openid':'563125632849524101','openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706' } } }
const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'3hewzzhpsp','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'2f12d907-56a9-3a46-9124-d4351e9fc878','parm3':'SM-G955F','openid':'565939577188654916','openkey':'51ba25dcc6757726dec6ba4c737e3ca134c49fb3' } } }

const error = JSON.stringify({
	system: {
	  version: {
			ver: 'V1.3.507',
			force: 1,
			status: 0,
			iosUrl: 'https://www.facebook.com/Kings-Throne-Game-of-Lust-891740894496936/',
			androidUrl: 'https://www.facebook.com/Kings-Throne-Game-of-Lust-891740894496936/',
	  },
	  sys: { time: 1614246286, nextTime: 1614297600 },
	},
})

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

	async login(user = LOGIN_ACCOUNT_NAPOLEON): Promise<any> {
		console.log('logging in')
		const response = await axios.post(this.base_url, user, {
			params: {
				sevid: this.server,
				ver: 'V1.3.507',
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

	private async sendRequest(data: unknown, gid = '699005053'): Promise<any> {
		if (!this.isLoggedIn) {await this.login()}

		const response =  await axios.post(this.base_url, data, {
			params: {
				sevid: this.server,
				ver: 'V1.3.507',
				uid: gid,
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
			throw new Error(response?.a?.system?.errror.msg)
			// process.exit()
		}

		return response
	}

	async getProfile(gid: number): Promise<Profile|null>  {
		const profile = await this.sendRequest({ user: { getFuserMember: { id: gid } },rsn: '5ypfaywvff' })

		if (profile?.a?.system?.errror) {
			return null
		}

		return profile.a.user.fuser
	}

	async getKingdomRankings(): Promise<KingdomRank[]> {
		const ladder = await this.sendRequest({ ranking:{ paihang:{ type:0 } }, rsn:'2ynxlnaqyx' })
		console.log(ladder.a)
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

	async getEventTourneyLadder(): Promise<EventRank[]> {
		const ladder = await this.sendRequest({ huodong:{ hd254Info:[] }, rsn:'3ekkszzrpf' })

		return ladder.a.cbhuodong.yamenlist
	}

	async getGameInfos(): Promise<GameInfos> {
		await this.login(LOGIN_ACCOUNT_GAUTIER)
		const game = await this.sendRequest({ rsn:'2ynbmhanlb',guide:{ login:{ language:1,platform:'gaotukc',ug:'' } } }, '699002934')

		return game.a
	}
}

export const client = new GoatRequest()
