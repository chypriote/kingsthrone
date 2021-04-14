import axios from 'axios'
import {
	Club,
	Profile,
	KingdomRank,
	TourneyRank,
	CastleInfos,
	XSAlliance,
	XSOpponent,
	InLaw,
	LuckStatus, ProcessionsStatus, ProcessionGain, ProcessionResult
} from '~/types/goat'
import { logger } from '../services/logger'
import { GameInfos, Wife } from '~/types/game'

const VERSION = 'V1.3.521'
const COOKIE = 'lyjxncc=fa3c2e7123aa51bdafd473520405ed0d'
export const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'4cfhvxxiim','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f','parm3':'SM-G955F','openid':'563125632849524101','openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706' } } }
export const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'5wjwfeefhf','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'82557521-a0b4-3441-a774-840066252311','parm3':'ONEPLUS A5000','openid':'565939577188654916','openkey':'3af6112ebee552af12f624b08a71699d7cd15bfd' } } }
export const LOGIN_ACCOUNT_701 = { 'rsn':'2maymbhnxnb','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'82557521-a0b4-3441-a774-840066252311','parm3':'ONEPLUS A5000','openid':'565939577188654916','openkey':'deb43d3a1b48b2f80d01ae6829834e9a309019f8' } } }
export const LOGIN_ACCOUNT_RAYMUNDUS = { 'rsn':'7xcxcypvslg','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'2630f405-13ed-3867-90e5-325059450d8e','parm3':'ONEPLUS A5000','openid':'573218842929144928','openkey':'78c249945d8d450de2111c2eebaa653b697f40c1' } } }


export const CASTLES_RSN = {
	castle_1: '5yprprvaae',
	castle_2: '7cydydogyv',
	castle_3: '6swwpwkwpxb',
	castle_4: '6wxlxlugsx',
	castle_5: '1kbibwuiri',
	castle_6: '8amxmxrkjm',
	castle_7: '3heseskfwp',
	castle_8: '9mninbtbci',
	castle_9: '6xukulblpx',
	castle_10: '4cfxfximbb',
}

const error = JSON.stringify({
	system: {
	  version: {
			ver: 'V1.3.521',
			force: 1,
			status: 0,
			iosUrl: 'https://www.facebook.com/Kings-Throne-Game-of-Lust-891740894496936/',
			androidUrl: 'https://www.facebook.com/Kings-Throne-Game-of-Lust-891740894496936/',
	  },
	  sys: { time: 1614246286, nextTime: 1614297600 },
	},
})

const OLD_HOST = 'zsjefunbm.zwformat.com'
const NEW_HOST = 'ksrus.gtbackoverseas.com'
export class GoatRequest {
	cookie: string
	token: string|null = null
	gid: string|null = null
	host: string
	base_url: string
	server: string

	isLoggedIn = false

	constructor(server = '699', cookie = COOKIE, host = NEW_HOST) {
		this.cookie = cookie
		this.server = server
		this.host = [OLD_HOST, NEW_HOST].includes(host) ? host : NEW_HOST
		this.base_url = `http://${host}/servers/s${server}.php`
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
				ver: VERSION,
				uid: '',
				token: '',
				platform: 'gaotukc',
				lang: 'en',
			},
			headers: {
				'Accept-Encoding': 'identity',
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; ONEPLUS A5000 Build/NMF26X)',
				'Host': this.host,
				'Cookie': this.cookie,
				'Connection': 'Keep-Alive',
			},
		}).then(response => response.data)

		if (!response?.a?.loginMod?.loginAccount?.token) {
			logger.error(`LoginError: ${response?.a?.system?.errror.msg}`)
			process.exit()
		}

		this.token = response?.a?.loginMod?.loginAccount?.token
		this.gid = response?.a?.loginMod?.loginAccount?.uid
		this.isLoggedIn = true

		return response.a.loginMod.loginAccount
	}

	private async sendRequest(data: unknown, ignoreError = false): Promise<any> {
		if (!this.isLoggedIn) {await this.login()}

		const response =  await axios.post(this.base_url, data, {
			params: {
				sevid: this.server,
				ver: VERSION,
				uid: this.gid,
				token: this.token,
				platform: 'gaotukc',
				lang: 'en',
			},
			headers: {
				'Accept-Encoding': 'identity',
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; ONEPLUS A5000 Build/NMF26X)',
				'Host': this.host,
				'Cookie': this.cookie,
				'Connection': 'Keep-Alive',
			},
		}).then(response => response.data)

		if (response?.a?.system?.errror) {
			if (!ignoreError) {logger.error(`RequestError: ${response?.a?.system?.errror.msg}`)}
			throw new Error(response?.a?.system?.errror.msg)
			process.exit()
		}

		return response
	}

	async getProfile(gid: number): Promise<Profile|null>  {
		const profile = await this.sendRequest({ user: { getFuserMember: { id: gid } }, rsn: '5ypfaywvff' })

		if (profile?.a?.system?.errror) {
			return null
		}

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

	async getGameInfos(): Promise<GameInfos> {
		const game = await this.sendRequest({ rsn:'2ynbmhanlb',guide:{ login:{ language:1,platform:'gaotukc',ug:'' } } })

		return game.a
	}

	//Kingdom
	async getCastleRewards(id: number): Promise<CastleInfos|false> {
		try {
			// @ts-ignore
			const reward = await this.sendRequest({ 'rsn': CASTLES_RSN[`castle_${id}`],'hangUpSystem':{ 'getRewards':{ 'type':'all','id':id } } }, true)

			return reward.u.hangUpSystem.info[0]
		} catch (e) {
			return false
		}
	}
	async claimAll(castleId: number): Promise<void> {
		try {
			await this.sendRequest({ 'rsn': '4acfahcffvm', 'hangUpSystem': { 'getSonDispatchRewards': { 'eventId': 'all', 'id': castleId } } })
		}catch (e) {
			console.log(`Failed at claimAll ${e.toString()}`)
		}
	}
	async claimQuest(eventId: string, castleId: number): Promise<void> {
		console.log(`Claim quest ${eventId} for castle ${castleId}`)
		try {
			await this.sendRequest({ 'rsn': '9zrmzjtbsjm','hangUpSystem': { 'getSonDispatchRewards': { 'eventId': eventId, 'id': castleId } } })
		}catch (e) {
			console.log(`Failed at claimQuest ${e.toString()}`)
		}
	}
	async sendQuest(eventId: string, castleId: number, sonId: number): Promise<void> {
		console.log(`Send son ${sonId} on quest ${eventId} for castle ${castleId}`)
		try {
			await this.sendRequest({ 'rsn': '9rztbmjirc','hangUpSystem': { 'sonDispatch': { 'son_slot': [{ 'slot': 1, 'sonId': sonId }],'isDouble': 0,'eventId': eventId,'id': castleId } } })
		}catch (e) {
			console.log(`Failed at sendQuest ${e.toString()}`)
		}
	}
	async refreshQuests(castleId: number): Promise<CastleInfos|false> {
		console.log(`Refreshing quests for castle ${castleId}`)
		try{
			const refresh = await this.sendRequest({ 'rsn':'3hzpseshen','hangUpSystem':{ 'refreshEvent':{ 'type':0,'id':castleId } } })

			return refresh.hangUpSystem.info[0]
		}catch (e) {
			console.log(`Failed at refreshQuests ${e.toString()}`)
			return false
		}
	}

	//Maidens
	async visitRandomMaiden(): Promise<Wife> {
		const visit = await this.sendRequest({ 'wife':{ 'sjxo':[] },'rsn':'9rzrtbtsrs' })

		return visit.u.wife.wifeList[0]
	}
	async useStaminaDraught(): Promise<{ count: number, id: number }> {
		console.log('Using stamina draught')
		const items = await this.sendRequest({ 'wife':{ 'weige':[] },'rsn':'7xcygxvyygp' })

		return items.u.item.itemList[0]
	}
	async getAvailableVisits(): Promise<{num: number, next: number}> {
		const next = await this.sendRequest({ 'user':{ 'refwife':[] },'rsn':'3zhfrhfehhe' })

		return next.a.wife.jingLi
	}

	//Processions
	async getAvailableProcessions(): Promise<ProcessionsStatus> {
		const next = await this.sendRequest({ 'user':{ 'refxunfang':[] },'rsn':'7cxvsdxvlp' })

		return next.a.xunfang.xfInfo
	}
	async startProcession(): Promise<ProcessionResult> {
		//kind 2= gold id2= gold
		const visit = await this.sendRequest({ 'rsn':'1tqrewqiru','xunfang':{ 'xunfan':{ 'type':0 } } })

		const result: ProcessionGain = visit.a.xunfang.win.xfAll[0]
		const luck: LuckStatus = visit.a.xunfang.recover
		const status: ProcessionsStatus  = visit.a.xunfang.xfInfo

		return { result, status, luck }
	}
	async useGoodwillDraught(): Promise<{ count: number, id: number }> { //id 72 goodwill
		console.log('Using goodwill draught')
		const items = await this.sendRequest({ 'rsn':'2ambwlxaxy','xunfang':{ 'recover':[] } })

		return items.u.item.itemList[0]
	}
	async setAutoDonation(value = 82, grain: boolean, gold: boolean): Promise<LuckStatus> {
		//num = current luck, ySet = min luck
		console.log(`Setting auto donation to ${value}`)

		const status = await this.sendRequest({ 'rsn':'4fhaibbigb','xunfang':{ 'yunshi':{
			auto3: grain ? 1 : 0,
			auto2: gold ? 1 : 0,
			ysSet: value,
		} } })

		return status.xunfang.recover
	}


	//InLaws
	async getInLaws(): Promise<InLaw[]> {
		const friends = await this.sendRequest({ 'friends':{ 'getPrivateChatData':[] },'rsn':'7yvovxpxyp' })

		return friends.a.friends.qjlist
	}

	async visitInLaw(uid: string): Promise<void> {
		await this.sendRequest({ 'friends':{ 'qjvisit':{ 'fuid': uid } },'rsn':'3hzewhwzkp' })
	}

	//Alliance Championship
	async getXSAlliances(): Promise<XSAlliance[]> {
		const alliances = await this.sendRequest({ 'rsn':'7yvxyypsgp','qxzb':{ 'qxzbInfo':[] } })

		return alliances.a.qxzb.rank
	}

	async getCrossOpponents(aid: number): Promise<XSOpponent[]> {
		const opponents = await this.sendRequest({ 'rsn':'2amabymqwx','qxzb':{ 'qxzbMatchByCid':{ 'cid':aid } } })

		return opponents.a.qxzb.qxzbfMatch.match
	}
}

export const client = new GoatRequest()
