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
	LuckStatus, ProcessionsStatus, ProcessionGain, ProcessionResult, XSPlayerRank, XSPlayer
} from '~/types/goat'
import { logger } from '../services/logger'
import { GameInfos, Wife } from '~/types/game'

const VERSION = 'V1.3.535'
const COOKIE = 'lyjxncc=c3ac4e77dff349b66c7aeed276e3eb6c'
export const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'4cfhvxxiim','login':{ 'loginAccount':{
	 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay',
	 'parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f','parm3':'SM-G955F',
	 'openid':'563125632849524101','openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706' } } }
export const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'5wjwfeefhf','login':{ 'loginAccount':{
	'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay',
	'parm6':'82557521-a0b4-3441-a774-840066252311','parm3':'ONEPLUS A5000',
	'openid':'565939577188654916','openkey':'3af6112ebee552af12f624b08a71699d7cd15bfd' } } }
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

const OLD_HOST = 'zsjefunbm.zwformat.com'
const NEW_HOST = 'ksrus.gtbackoverseas.com'
export class GoatRequest {
	cookie: string
	token: string|null = null
	gid: string|null = null
	host: string
	base_url: string
	server: string
	version: string

	isLoggedIn = false

	constructor(server = '699', cookie = COOKIE, host = NEW_HOST) {
		this.cookie = cookie
		this.server = server
		this.host = [OLD_HOST, NEW_HOST].includes(host) ? host : NEW_HOST
		this.base_url = `http://${host}/servers/s${server}.php`
		this.version = VERSION
	}

	setServer(server: string): this {
		this.server = server
		logger.warn(`Set server to ${server}`)
		return this
	}
	setVersion(version: string): this {
		this.version = version
		logger.warn(`Set version to ${version}`)
		return this
	}
	setGid(gid: string): this {
		this.gid = gid === '691005139' ? '691005130' : gid
		return this
	}

	async login(user = LOGIN_ACCOUNT_NAPOLEON): Promise<any> {
		console.log(`logging in ${this.server}`)
		const response = await axios.post(this.base_url, user, {
			params: {
				sevid: this.server,
				ver: this.version,
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
		this.setGid(response?.a?.loginMod?.loginAccount?.uid.toString())
		this.isLoggedIn = true

		return response.a.loginMod.loginAccount
	}

	private async sendRequest(data: unknown, ignoreError = false): Promise<any> {
		if (!this.isLoggedIn) {await this.login()}

		const response =  await axios.post(this.base_url, data, {
			params: {
				sevid: this.server,
				ver: this.version,
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
			if (ignoreError) {logger.error(`RequestError: ${response?.a?.system?.errror.msg}`); return}
			throw new Error(`RequestError: ${response?.a?.system?.errror.msg}`)
		}
		if (response?.a?.system?.version) {
			this.setVersion(response.a.system.version.ver)
			return await this.sendRequest(data)
		}

		return response
	}

	async getProfile(gid: number): Promise<Profile|null>  {
		const profile = await this.sendRequest({ user: { getFuserMember: { id: gid } }, rsn: '1taquiwekk' })

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

	//Tourney Championship
	async getXSTourney(): Promise<XSPlayerRank[]> {
		const tourney = await this.sendRequest({ 'kuayamen':{ 'getRank':[] },'rsn':'3zhfrfnwhke' })

		return tourney.a.kuayamen.scoreRank
	}
	async getXSPlayer(gid: number): Promise<XSPlayer> {
		const player = await this.sendRequest({ 'kuayamen':{ 'findzhuisha':{ 'fuid': gid } },'rsn':'1tqrireark' })

		return player.a.kuayamen.zhuisha.fuser
	}

	//Account creation
	async createAccount(server: string): Promise<void|GameInfos> {
		this.setServer(server)
		const player = await this.getGameInfos()

		if (player.user.user.name) {
			logger.warn(`Found existing player named ${player.user.user.name} on server ${server}`)
			return player
		}

		const name = await this.setName(`Raymundus ${server}`)
		if (!name) {process.exit()}
		console.log('Skipping guide')
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'8ajixearke' })
		await this.sendRequest({ 'fuli':{ 'answer':{ 'code':'tg' } },'rsn':'6wsylkxbug' })
		await this.sendRequest({ 'rsn':'9zrsjbmimms','guide':{ 'guideUpguan':[] } })
		await this.sendRequest({ 'rsn':'8mvjxiivxm','guide':{ 'guide':{ 'gnew':1 } } })

		console.log('Getting levies')
		await this.sendRequest({ 'rsn':'5yvjaevaeh','guide':{ 'guide':{ 'gnew':2 } } })
		await this.sendRequest({ 'fuli':{ 'auto_supreme':[] },'rsn':'8ajixejxxe' })
		await this.sendRequest({ 'user':{ 'refjingying':[] },'rsn':'1tqrwiautk' })
		await this.sendRequest({ 'user':{ 'jingYing':{ 'jyid':2 } },'rsn':'6wsylkxyxx' })
		await this.sendRequest({ 'rsn':'2maxwlmbmay','guide':{ 'guide':{ 'gnew':3 } } })
		await this.sendRequest({ 'user':{ 'jingYing':{ 'jyid':3 } },'rsn':'6xpslyusbk' })
		await this.sendRequest({ 'rsn':'1tqrwiatqu','guide':{ 'guide':{ 'gnew':4 } } })
		await this.sendRequest({ 'user':{ 'jingYing':{ 'jyid':4 } },'rsn':'4acmhxagbgb' })
		await this.sendRequest({ 'rsn':'3hznswfhrf','guide':{ 'guide':{ 'gnew':5 } } })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'8ajixekaxi' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'jingying' } },'rsn':'2maxwlmbhqq' })
		await this.sendRequest({ 'rsn':'6wsylkgxxx','guide':{ 'guide':{ 'smap':0,'bmap':1,'mmap':1 } } })

		console.log('Campaign')
		await this.sendRequest({ 'user':{ 'pve':[] },'rsn':'5jwfvajwyyf' })
		await this.sendRequest({ 'rsn':'8mvjxiekxm','guide':{ 'guide':{ 'gnew':6 } } })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'jingying' } },'rsn':'3hznswfeke' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'4cavxbmfhv' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'jingying' } },'rsn':'5yvjaerpay' })
		await this.sendRequest({ 'rsn':'5yvjaereyf','guide':{ 'guide':{ 'gnew':7 } } })

		console.log('Upgrade Gerard')
		await this.sendRequest({ 'hero':{ 'upgrade':{ 'id':2 } },'rsn':'1qtaewqtqwk' })
		await this.sendRequest({ 'rsn':'5yvjaereyf','guide':{ 'guide':{ 'gnew':7 } } })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'8ajixekkoe' })


		console.log('Fight Boss')
		await this.sendRequest({ 'user':{ 'pvb':{ 'is_guide':1,'id':2 } },'rsn':'4acmhxacvgb' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'5jwfvajvrhh' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'9zrsjbzjics' })

		console.log('Collect quest 1')
		await this.sendRequest({ 'task':{ 'taskdo':{ 'id':1 } },'rsn':'6swgplswlux' })
		await this.sendRequest({ 'rsn':'5jwfvajvaff','guide':{ 'guide':{ 'gnew':8 } } })

		logger.success(`Created ${name} on server ${server}`)
	}
	async getGeneratedName(): Promise<string> {
		const name = await this.sendRequest({ 'rsn':'6xpsluwksy','guide':{ 'randName':{ 'sex':1 } } })

		return name.a.system.randname.name
	}
	async setName(name: string): Promise<string> {
		await this.sendRequest({ 'rsn':'6xpsluwkyk','guide':{ 'setUinfo':{ 'sex':1,name,'job':7 } } })

		return name
	}
}

export const client = new GoatRequest()
