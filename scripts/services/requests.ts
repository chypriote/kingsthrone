import axios from 'axios'
import {
	AllianceBossInfo,
	Club,
	HallOfFamer,
	InLaw,
	KingdomRank,
	Profile,
	TourneyRank,
	User,
	XSAlliance,
	XSOpponent,
	XSPlayer
} from '~/types/goatGeneric'
import { logger } from '../services/logger'
import { GameInfos, Wife } from '~/types/game'
import { FHero, FShop, OngoingFight, TourneyReward } from '~/types/tourney'
import { PunishmentResult } from '~/types/goat/PunishmentResult'
import { GoodwillResult, LuckStatus, ProcessionResult, ProcessionsStatus } from '~/types/goat/Processions'
import { StaminaResult, VisitsStatus } from '~/types/goat/Maidens'
import { FeastDetails, FeastInfo, FeastShop, FeastStatus, OngoingFeast } from '~/types/goat/Feasts'
import { DECREE_TYPE } from '~/types/goat/Generic'
import { ExpeditionInfo, KingdomExpInfo, MerchantInfos } from '~/types/goat/Expeditions'
import { CastleInfos } from '~/types/goat/Kingdom'
import { XSOngoingFight, XSTourneyReward } from '~/types/goat/XSTourney'
import { DMOngoingFight, DMRanking, DMTourneyReward } from '~/types/goat/DMTourney'

const VERSION = 'V1.3.549'
const COOKIE = 'lyjxncc=c3ac4e77dff349b66c7aeed276e3eb6c'
export const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'2ylxannmqx','login':{ 'loginAccount':{
	'parm1':'WIFI','platform':'gaotukc',
	'parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15',
	'parm3':'ONEPLUS A5000','openid':'563125632849524101',
	'openkey':'6b66102c0d0e963ee2f6ebe96a2344917c3faca4' } } }
export const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'2axwqwhxyx','login':{ 'loginAccount':{
	'parm1':'WIFI','platform':'gaotukc',
	'parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15',
	'parm3':'ONEPLUS A5000','openid':'565939577188654916',
	'openkey':'b4d47e9c7beaf15e97f899c8cd4f2bbc4f31c3bc' } } }
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
		logger.warn(`Logged in on ${this.server} as ${this.gid}`)

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
			throw new Error(response?.a?.system?.errror.msg || JSON.stringify(response))
		}
		if (response?.a?.system?.version) {
			this.setVersion(response.a.system.version.ver)
			return await this.sendRequest(data)
		}

		return response
	}

	async getProfile(gid: string): Promise<Profile|null>  {
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
	async getChapterRwdList(): Promise<void> {
		const data = await this.sendRequest({ 'user':{ 'getChapterRwdList':[] },'rsn':'9zriizmmnmt' })

		return data
	}
	async getCastleRewards(id: number): Promise<CastleInfos|false> {
		try {
			// @ts-ignore
			const reward = await this.sendRequest({ 'rsn': CASTLES_RSN[`castle_${id}`],'hangUpSystem':{ 'getRewards':{ 'type':'all','id':id } } })
			console.log('Claimed maiden rewards')
			return reward.u.hangUpSystem.info[0]
		} catch (e) {
			return false
		}
	}
	async claimAll(castleId: number): Promise<void> {
		try {
			await this.sendRequest({ 'rsn': '4acfahcffvm', 'hangUpSystem': { 'getSonDispatchRewards': { 'eventId': 'all', 'id': castleId } } })
		}catch (e) {
			logger.error(`Failed at claimAll ${e.toString()}`)
		}
	}
	async claimQuest(eventId: string, castleId: number): Promise<void> {
		logger.log(`Claim quest ${eventId} for castle ${castleId}`)
		try {
			await this.sendRequest({ 'rsn': '9zrmzjtbsjm','hangUpSystem': { 'getSonDispatchRewards': { 'eventId': eventId, 'id': castleId } } })
		}catch (e) {
			logger.error(`Failed at claimQuest ${e.toString()}`)
		}
	}
	async sendQuest(eventId: string, castleId: number, sons: number[]): Promise<void> {
		try {
			const sonsSlots: {slot: number, sonId: number}[] = []
			sons.forEach((sonId, index) => sonsSlots.push({ slot: index + 1, sonId: sonId }))
			logger.log(`Send son(s) ${sons} on quest ${eventId} for castle ${castleId}`)

			await this.sendRequest({ 'rsn': '9rztbmjirc','hangUpSystem': { 'sonDispatch': {
				'son_slot': sonsSlots,
				'isDouble': 0,
				'eventId': eventId,
				'id': castleId,
			} } })
		}catch (e) {
			logger.error(`Failed at sendQuest ${e.toString()}`)
		}
	}
	async refreshQuests(castleId: number): Promise<CastleInfos|false> {
		logger.log(`Refreshing quests for castle ${castleId}`)
		try{
			const refresh = await this.sendRequest({ 'rsn':'3hzpseshen','hangUpSystem':{ 'refreshEvent':{ 'type':0,'id':castleId } } })

			return refresh.u.hangUpSystem.info[0]
		}catch (e) {
			logger.error(`Failed at refreshQuests ${e.toString()}`)
			return false
		}
	}

	//Maidens
	async visitRandomMaiden(): Promise<Wife> {
		const visit = await this.sendRequest({ 'wife':{ 'sjxo':[] },'rsn':'9rzrtbtsrs' })

		return visit.u.wife.wifeList[0]
	}
	async useStaminaDraught(num = 1): Promise<StaminaResult> {
		const items = await this.sendRequest({ 'wife':{ 'weige':{ num } },'rsn':'3zhwezreeef' })

		return {
			items: items.u.item.itemList[0],
			status: items.a.wife.jingLi,
		}
	}
	async getAvailableVisits(): Promise<VisitsStatus> {
		const next = await this.sendRequest({ 'user':{ 'refwife':[] },'rsn':'9zrimzcbbis' })

		return next.a.wife.jingLi
	}

	//Processions
	async getAvailableProcessions(): Promise<ProcessionsStatus> {
		const next = await this.sendRequest({ 'user':{ 'refxunfang':[] },'rsn':'4cmiixghbg' })

		return next.a.xunfang.xfInfo
	}
	async startProcession(): Promise<ProcessionResult> {
		//kind 2= gold id2= gold
		const visit = await this.sendRequest({ 'rsn':'9rsnniiijc','xunfang':{ 'xunfan':{ 'type':0 } } })

		return  {
			result: visit.a.xunfang.win.xfAll[0],
			luck: visit.a.xunfang.recover,
			status: visit.a.xunfang.xfInfo,
		}
	}
	async useGoodwillDraught(num = 1): Promise<GoodwillResult> { //id 72 goodwill
		const items = await this.sendRequest({ 'rsn':'9mbrrjbsrc','xunfang':{ 'recover':{ num } } })

		return  {
			items: items.u.item.itemList[0],
			status: items.a.xunfang.xfInfo,
		}
	}
	async setAutoDonation(value = 82, grain: boolean, gold: boolean): Promise<LuckStatus> {
		//num = current luck, ySet = min luck
		logger.log(`Setting auto donation to ${value}`)

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
	async getXSTourney(): Promise<User[]> {
		const tourney = await this.sendRequest({ 'kuayamen':{ 'getRank':[] },'rsn':'3zhfrfnwhke' })

		return tourney.a.kuayamen
	}
	async getXSPlayer(gid: string): Promise<XSPlayer> {
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

		let name = `Raymundus ${server}`
		try {
			name = await this.setName(name)
			if (!name) {console.log('exiting'); process.exit()}
		} catch (e) { console.log('catching name error') }
		logger.debug('Skipping guide')
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'8ajixearke' })
		await this.sendRequest({ 'fuli':{ 'answer':{ 'code':'tg' } },'rsn':'2ylhaxxbwy' })
		await this.sendRequest({ 'rsn':'9zrsjbmimms','guide':{ 'guideUpguan':[] } })
		await this.sendRequest({ 'rsn':'8mvjxiivxm','guide':{ 'guide':{ 'gnew':1 } } })

		logger.debug('Getting levies')
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

		logger.debug('Campaign')
		await this.sendRequest({ 'user':{ 'pve':[] },'rsn':'5jwfvajwyyf' })
		await this.sendRequest({ 'rsn':'8mvjxiekxm','guide':{ 'guide':{ 'gnew':6 } } })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'jingying' } },'rsn':'3hznswfeke' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'4cavxbmfhv' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'jingying' } },'rsn':'5yvjaerpay' })
		await this.sendRequest({ 'rsn':'5yvjaereyf','guide':{ 'guide':{ 'gnew':7 } } })

		logger.debug('Upgrade Gerard')
		await this.sendRequest({ 'hero':{ 'upgrade':{ 'id':2 } },'rsn':'1qtaewqtqwk' })
		await this.sendRequest({ 'rsn':'5yvjaereyf','guide':{ 'guide':{ 'gnew':7 } } })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'8ajixekkoe' })


		logger.debug('Fight Boss')
		await this.sendRequest({ 'user':{ 'pvb':{ 'is_guide':1,'id':2 } },'rsn':'4acmhxacvgb' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'5jwfvajvrhh' })
		await this.sendRequest({ 'user':{ 'adok':{ 'label':'' } },'rsn':'9zrsjbzjics' })

		logger.debug('Collect quest 1')
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

	//Tourney
	async getTourneyInfos(): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'yamen':{ 'yamen':[] },'rsn':'1qtiuqurtia' })

		return data.a.yamen
	}
	async getTourneyAdok(): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'user':{ 'adok':{ 'label':'yamen' } },'rsn':'6swkbswywgg' })

		return data.a.warHorse
	}
	async startTourneyFight(): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'yamen':{ 'pizun':[] },'rsn':'3esphksnsn' })

		return data.a.yamen
	}
	async startTokenTourneyFight(): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'yamen':{ 'chushi':[] },'rsn':'3espeerwpw' })

		return data.a.yamen
	}
	async buyTourneyBoost(item: FShop): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'yamen':{ 'seladd':{ id: item.id } },'rsn':'2ylqabmbqq' }, true)

		return data.a.yamen
	}
	async fightHero(hero: FHero): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'yamen':{ 'fight':{ 'id': hero.id } },'rsn':'3zhwpzzrphn' })

		return data.a.yamen
	}
	async getReward(): Promise<TourneyReward> {
		const data = await this.sendRequest({ 'yamen':{ 'getrwd':[] },'rsn':'1tabuiiqwa' })

		return data.a.yamen.win.rwd
	}
	async challengeOpponent(uid: string, hid: number): Promise<OngoingFight> {
		const data = await this.sendRequest({ 'yamen':{ 'zhuisha':{ 'fuid':uid,'hid':hid } },'rsn':'8mxoaeekoe' })

		return data.a.yamen
	}
	async getTourneyReward(id: number): Promise<boolean> {
		try {
			await this.sendRequest({ 'yamen':{ 'getdilyrwd':{ id } },'rsn':'5yawyvphhr' })
			return true
		}catch (e) {/*We want to ignore completely*/}
		return false
	}

	//XSTourney
	async xsGetTourneyInfos(): Promise<XSOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'yamen':[] },'rsn':'2malnlahyqq' })

		return data.a.kuayamen
	}
	async xsStartTourneyFight(): Promise<XSOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'pizun':[] },'rsn':'3esphksnsn' })

		return data.a.kuayamen
	}
	async xsStartTokenTourneyFight(): Promise<XSOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'chushi':[] },'rsn':'3espeerwpw' })

		return data.a.kuayamen
	}
	async xsBuyTourneyBoost(item: FShop): Promise<XSOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'seladd':{ 'id':item.id } },'rsn':'5wfrarhwer' }, true)

		return data.a.kuayamen
	}
	async xsFightHero(hero: FHero): Promise<XSOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'fight':{ 'id':hero.id } },'rsn':'6wgklkbxkx' })

		return data.a.kuayamen
	}
	async xsGetReward(): Promise<XSTourneyReward> {
		const data = await this.sendRequest({ 'kuayamen':{ 'getrwd':[] },'rsn':'2axhlhqxbh' })

		return data.a.kuayamen.win.rwd
	}
	async xsChallengeOpponent(uid: string, hid: number): Promise<XSOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'zhuisha':{ 'fuid':uid,'hid':hid } },'rsn':'5yavaehwer' })

		return data.a.kuayamen
	}
	async xsGetTourneyReward(id: number): Promise<boolean> {
		try {
			await this.sendRequest({ 'yamen':{ 'getdilyrwd':{ id } },'rsn':'5yawyvphhr' })
			return true
		}catch (e) {/*We want to ignore completely*/}
		return false
	}

	//Deathmatch
	async dmGetTourneyInfos(): Promise<DMOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdComeHd':[] },'rsn':'3esswfnhew' })

		return data.a.jdyamen
	}
	async dmStartTourneyFight(): Promise<DMOngoingFight> {
		await this.sendRequest({ 'kuayamen':{ 'jdSjtz':[] },'rsn':'1qtwwrwewku' })
		const data = await this.sendRequest({ 'kuayamen':{ 'jdPiZhun':[] },'rsn':'6xllkgklyg' })

		return data.a.jdyamen
	}
	async dmStartTokenTourneyFight(): Promise<DMOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdChushi':[] },'rsn':'4cmxxihghg' })

		return data.a.jdyamen
	}
	async dmBuyTourneyBoost(item: FShop): Promise<DMOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdSeladd':{ 'id':item.id } },'rsn':'7yddpollxv' }, true)

		return data.a.jdyamen
	}
	async dmFightHero(hero: FHero): Promise<DMOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdFight':{ 'id':hero.id } },'rsn':'2yllhnqywb' })

		return data.a.jdyamen
	}
	async dmGetReward(): Promise<DMTourneyReward> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdGetrwd':[] },'rsn':'5wfaaypfer' })

		return data.a.jdyamen.win.rwd
	}
	async dmChallengeOpponent(uid: string, hid: number): Promise<DMOngoingFight> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdZhuiSha':{ 'fuid':uid,'hid':hid } },'rsn':'7xcddslcgvg' })

		return data.a.jdyamen
	}
	async dmGetRankings (): Promise<DMRanking> {
		const data = await this.sendRequest({ 'kuayamen':{ 'jdGetRank':{ 'type':1 } },'rsn':'3zeppnfzhse' })

		return data.a.jdyamen
	}


	//General
	async punishPrisoner(): Promise<PunishmentResult> {
		const data = await this.sendRequest({ 'rsn':'9rsnniccct','laofang':{ 'bianDa':{ 'type':1 } } })

		return data.a.laofang
	}
	async raiseAllSons(): Promise<boolean> {
		try {
			await this.sendRequest({ 'rsn':'3hfkkwrshp','son':{ 'allplay':[] } })
		} catch (e) {
			return false
		}
		return true
	}
	async getAllLevies(): Promise<void> {
		await this.sendRequest({ 'user':{ 'jingYingAll':[] },'rsn':'1tabbiiurr' })
	}
	async getAllDecreesResources(type: DECREE_TYPE): Promise<void> {
		await this.sendRequest({ 'user':{ 'yjZhengWu':{ 'act': type } },'rsn':'1tabbiitbi' })
	}
	async claimLoginReward(): Promise<void> {
		await this.sendRequest({ 'fuli':{ 'qiandao':[] },'rsn':'6wguukkgpk' })
	}
	async readAllMail(): Promise<void> {
		await this.sendRequest({ 'rsn':'6swkxspslyk','mail':{ 'redAllMails':[] } })
	}
	async deleteAllMail(): Promise<void> {
		await this.sendRequest({ 'rsn':'7xcpyxsxdsv','mail':{ 'delMails':[] } })
	}
	async finishTraining(): Promise<boolean> {
		try {
			await this.sendRequest({ 'rsn':'9zrimzjntjm','school':{ 'allover':[] } })
		} catch (e) {
			return false
		}
		return true
	}
	async startTraining(): Promise<void> {
		await this.sendRequest({ 'rsn':'6wguulskgy','school':{ 'allstart':[] } })
	}
	/** @experimental */
	async getHoFInfo(): Promise<HallOfFamer[]> {
		const data = await this.sendRequest({ 'rsn':'5jwryjrwjje','huanggong':{ 'getNewInfo':[] } })

		return data.a.huanggong.Info
	}
	async getHoFTitle(): Promise<HallOfFamer[]> {
		const data = await this.sendRequest({ 'rsn':'3zhwezwzknw','huanggong':{ 'getInfoByWid':{ 'wid':2 } } })

		return data.a.huanggong.widInfo
	}
	async payHomage(): Promise<void> {
		await this.sendRequest({ 'rsn':'6wguulyyyy','huanggong':{ 'qingAn':{ 'fuid':699002934,'chenghao':2 } } })
	}
	async claimHomage(): Promise<void> {
		await this.sendRequest({ 'rsn':'4fxccxgmfm','chenghao':{ 'wyrwd':[] } })
	}

	//Alliance
	async contributeAlliance(): Promise<void> {
		await this.sendRequest({ 'club':{ 'dayGongXian':{ 'dcid':5 } },'rsn':'3hfkksnwfn' })
	}
	async getAllianceBossInfo(): Promise<AllianceBossInfo[]> {
		const data = await this.sendRequest({ 'club':{ 'clubBossInfo':[] },'rsn':'5wfppaeavy' })

		return data.a.club.bossInfo
	}
	async fightAllianceBoss(boss: number, hero: number): Promise<void> {
		await this.sendRequest({ 'club':{ 'clubBossPK':{ 'cbid': boss,'id':hero } },'rsn':'4acbfaxfaxf' }, true)
	}

	//Feasts
	async getFeastsInfo(): Promise<FeastInfo> {
		const data = await this.sendRequest({ 'jiulou':{ 'jlInfo':[] },'rsn':'3zhwezswfze' })

		return data.a.jiulou
	}
	async getFeast(uid: string|null): Promise<FeastDetails> {
		const data = await this.sendRequest({ 'jiulou':{ 'yhGo':{ 'fuid':uid } },'rsn':'2ylayqahmb' })

		return data.a.jiulou.yhInfo
	}
	async openFeast(): Promise<void> {
		await this.sendRequest({ 'jiulou':{ 'yhHold':{ 'type':1,'isPush':1,'isOpen':true } },'rsn':'8akriooeom' })
	}
	async joinFeast(uid: string, seat: number): Promise<{ jfly: FeastStatus, jlShop: FeastShop, yhInfo: OngoingFeast[] }> {
		const data = await this.sendRequest({ 'jiulou':{ 'yhChi':{ 'type':3,'xwid':seat,'fuid': uid } },'rsn':'9rsnctrnrt' })

		const { jfly, jlShop, yhInfo } = data.a.jiulou
		return { jfly, jlShop, yhInfo }
	}
	async buyFeastItem(id: number): Promise<void> {
		await this.sendRequest({ 'jiulou':{ 'shopChange':{ id } },'rsn':'5wfvrfphye' })
	}

	//Rankings
	async payHomageKP(): Promise<void> {
		await this.sendRequest({ 'rsn':'5jwryfwjhjy','ranking':{ 'mobai':{ 'type':1 } } })
	}
	async payHomageCampaign(): Promise<void> {
		await this.sendRequest({ 'rsn':'3hfknpzerw','ranking':{ 'mobai':{ 'type':2 } } })
	}
	async payHomageIntimacy(): Promise<void> {
		await this.sendRequest({ 'rsn':'4cmivgafxm','ranking':{ 'mobai':{ 'type':3 } } })
	}

	//Merchants & Expeditions
	async getMerchantStatus(): Promise<MerchantInfos> {
		const data = await this.sendRequest({ 'silkroad':{ 'trade':[] },'rsn':'7ydyyyoccv' })
		return data.a.trade.Info
	}
	async merchantVentures(count: number): Promise<void> {
		if (!count) { return }
		await this.sendRequest({ 'silkroad': { 'rootPlay': { 'gid': count } }, 'rsn': '5yawyhvjrr' })
	}
	async getExpeditionsStatus(): Promise<ExpeditionInfo> {
		const data = await this.sendRequest({ 'rsn':'5wfewwyayr','taofa':{ 'taofa':[] } })
		return data.a.taofa.playInfo
	}
	async multipleExpeditions(count: number): Promise<ExpeditionInfo> {
		const data = await this.sendRequest({ 'rsn':'1tabruqibu','taofa':{ 'rootPlay':{ 'gid':count } } })

		return data.a.taofa.playInfo
	}
	async doExpedition(id: number): Promise<ExpeditionInfo> {
		const data = await this.sendRequest({ 'rsn':'9mbrmtbrmt','taofa':{ 'play':{ id } } })

		return data.a.taofa.playInfo
	}

	async getKingdomExpStatus(): Promise<KingdomExpInfo> {
		const data = await this.sendRequest({ 'huodong':{ 'hd1268Info':[] },'rsn':'6wgpksxxky' })

		return data.a.kingdomExpedition.info
	}
	async sendKingdomExp(level: number): Promise<KingdomExpInfo> {
		const heroes = goat.gid === '699002934' ? [
			{ 'pos':1,'power':999999999,'hid':41 },
			{ 'pos':2,'power':999999999,'hid':3 },
			{ 'pos':3,'power':999999999,'hid':8 },
			{ 'pos':4,'power':999999999,'hid':58 },
			{ 'pos':5,'power':999999999,'hid':52 },
		] : [
			{ 'pos':1,'power':999999999,'hid':41 },
			{ 'pos':2,'power':999999999,'hid':3 },
			{ 'pos':3,'power':999999999,'hid':18 },
			{ 'pos':4,'power':999999999,'hid':58 },
			{ 'pos':5,'power':999999999,'hid':204 },
		]
		const data = await this.sendRequest({ 'huodong':{ 'hd1268Play':{
			'heros': heroes,'id': level } },'rsn':'1kwbrrruqr' })

		return data.a.kingdomExpedition.info
	}

	//Daily rewards
	async claimDailyPoints(): Promise<void> {
		await this.sendRequest({ 'daily':{ 'getAlltask':[] },'rsn':'9zrizbjjmcs' })
	}
	async claimWeeklyPoints(): Promise<void> {
		await this.sendRequest({ 'weekly':{ 'getAlltask':[] },'rsn':'4acbaxhhvaf' })
	}
	async getDailyReward(id: number): Promise<boolean> {
		try {
			await this.sendRequest({ 'daily': { 'getrwd': { id } }, 'rsn': '2axnbamnxy' })
			return true
		}catch (e) {/*We want to ignore completely*/}
		return false
	}
	async getWeeklyReward(id: number): Promise<boolean> {
		try {
			await this.sendRequest({ 'weekly': { 'getrwd': { id } }, 'rsn': '2axnbamnxy' })
			return true
		}catch (e) {/*We want to ignore completely*/}
		return false
	}

	async attackMinion(id: number): Promise<void> {
		try {
			await this.sendRequest({ 'wordboss':{ 'hitmenggu':{ id } },'rsn':'4fxvghbbxf' })
		} catch (e) {
			console.log(e)
		}
	}
	async attackBoss(id: number): Promise<void> {
		try {
			await this.sendRequest({ 'wordboss':{ 'hitgeerdan':{ id } },'rsn':'8mxiaxameo' })
		} catch (e) {
			console.log(e)
		}

	}

	async hostCouncil(num = 3): Promise<void> {
		await this.sendRequest({ 'rsn':'3eseehnzfw','hanlin':{ 'opendesk':{ num,'isPush':1 } } })
	}
	async visitInLaws(): Promise<void> {
		await this.sendRequest({ 'friends':{ 'qjvisit':{ 'fuid':0 } },'rsn':'4acbmmxgfmg' })
	}
}

export const goat = new GoatRequest()
