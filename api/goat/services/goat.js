const axios = require('axios')
const logger = require('../../logger/services/logger')

const VERSION = 'V1.3.559'
const COOKIE = 'lyjxncc=c3ac4e77dff349b66c7aeed276e3eb6c'
const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'2ylxannmqx','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15','parm3':'ONEPLUS A5000','openid':'563125632849524101','openkey':'6b66102c0d0e963ee2f6ebe96a2344917c3faca4' } } }
const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'2axwqwhxyx','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15','parm3':'ONEPLUS A5000','openid':'565939577188654916','openkey':'b4d47e9c7beaf15e97f899c8cd4f2bbc4f31c3bc' } } }
const OLD_HOST = 'zsjefunbm.zwformat.com'
const NEW_HOST = 'ksrus.gtbackoverseas.com'

class GoatRequest {
	cookie
	token = null
	gid = null
	host
	base_url
	server
	version

	isLoggedIn = false

	constructor(server = '699', cookie = COOKIE, host = NEW_HOST) {
		this.cookie = cookie
		this.server = server
		this.host = [OLD_HOST, NEW_HOST].includes(host) ? host : NEW_HOST
		this.base_url = `http://${host}/servers/s${server}.php`
		this.version = VERSION
	}

	setServer(server) {
		this.server = server
		logger.warn(`Set server to ${server}`)
		return this
	}
	setVersion(version) {
		this.version = version
		logger.warn(`Set version to ${version}`)
		return this
	}
	setGid(gid) {
		this.gid = gid === '691005139' ? '691005130' : gid
		return this
	}

	async login(user = LOGIN_ACCOUNT_NAPOLEON) {
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
			throw new Error(`LoginError: ${response?.a?.system?.errror.msg}`)
		}

		this.token = response?.a?.loginMod?.loginAccount?.token
		this.setGid(response?.a?.loginMod?.loginAccount?.uid.toString())
		this.isLoggedIn = true
		logger.warn(`Logged in on ${this.server} as ${this.gid}`)

		return response.a.loginMod.loginAccount
	}

	async sendRequest(data, ignoreError = false) {
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

	async getProfile(gid)  {
		const profile = await this.sendRequest({ user: { getFuserMember: { id: gid } }, rsn: '6wgsbkuubx' })

		if (profile?.a?.system?.errror) {
			return null
		}

		return profile.a.user.fuser
	}

	async getKingdomRankings() {
		const ladder = await this.sendRequest({ ranking:{ paihang:{ type:0 } }, rsn:'2ynxlnaqyx' })

		return ladder.a.ranking.shili
	}

	async getTourneyRankings() {
		const tourney = await this.sendRequest({ yamen:{ getrank:[] }, rsn:'8jaaovjikee' })

		return tourney.a.yamen.rank
	}

	async getAllianceLadder() {
		const alliances = await this.sendRequest({ club:{ clubList:[] },rsn:'3zhpsspfrse' })

		return alliances.a.club.clubList
	}

	/** Returns the full game infos from player, see types/goat */
	async getGameInfos() {
		await this.login(LOGIN_ACCOUNT_GAUTIER)
		const game = await this.sendRequest({ rsn:'2ynbmhanlb',guide:{ login:{ language:1,platform:'gaotukc',ug:'' } } }, '699002934')

		return game.a
	}

	/**
	 * {"next":1614718819,"num":1,"label":"jingli"}
	 * next: timestamp for next visit
	 * num: available visits
	 * label ?
	 */
	async getMaidenVisits() {
		await this.login(LOGIN_ACCOUNT_GAUTIER)
		const maidens = await this.sendRequest({ 'user':{ 'refwife':[] },'rsn':'3hesfzewkf' }, '699002934')

		return maidens.a.wife.jingLi
	}

	/**
	 * {base: {allLove: 1574}} //total intimacy
	 * wifeList: [
	 * {"id":"2","love":70,"flower":35,"exp":404,
	 * "skill":[{"id":7,"level":34,"exp":226},{"id":8,"level":39,"exp":642},{"id":9,"level":5,"exp":607},{"id":10,"level":0,"exp":0},{"id":11,"level":0,"exp":0},{"id":12,"level":0,"exp":0}],
	 * "state":"1","num":"3","trans":-1,"banish":0}
	 * ]
	 * returns the updated wife
	 */
	async getRandomVisit() {
		await this.login(LOGIN_ACCOUNT_GAUTIER)
		const visit = await this.sendRequest({ 'wife':{ 'sjxo':[] },'rsn':'5jwwvvjaffr' }, '699002934')

		return visit.u.wife.wifeList[0]
	}

	/**
	 * {"num":1,"next":1614722244,"label":"xunfangtili"}
	 * next: timestamp for next procession
	 * num: available processions
	 * label ?
	 */
	async getProcessionsAvailable() {
		await this.login(LOGIN_ACCOUNT_GAUTIER)
		const processions = await this.sendRequest({ 'user':{ 'refxunfang':[] },'rsn':'4fibbbfifm' }, '699002934')

		return processions.xunfang.xfInfo
	}

	/**
	 * {"num":1,"next":1614722244,"label":"xunfangtili"}
	 * next: timestamp for next procession
	 * num: available processions
	 * label ?
	 */
	async getRandomProcession() {
		await this.login(LOGIN_ACCOUNT_GAUTIER)
		const procession = await this.sendRequest({ 'rsn':'6wxlggwupb','xunfang':{ 'xunfan':{ 'type':0 } } }, '699002934')

		return procession.xunfang.xfInfo
	}
}

module.exports = new GoatRequest()
