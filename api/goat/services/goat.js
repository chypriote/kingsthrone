const axios = require('axios')
const logger = require('../../logger/services/logger')

const VERSION = 'V1.3.533'
const COOKIE = 'lyjxncc=c3ac4e77dff349b66c7aeed276e3eb6c'
const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'4cfhvxxiim','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f','parm3':'SM-G955F','openid':'563125632849524101','openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706' } } }
const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'3hewzzhpsp','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'2f12d907-56a9-3a46-9124-d4351e9fc878','parm3':'SM-G955F','openid':'565939577188654916','openkey':'51ba25dcc6757726dec6ba4c737e3ca134c49fb3' } } }
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
		console.log(`Set server to ${server}`)
		this.server = server
		return this
	}
	setVersion(version) {
		this.version = version
		logger.warn(`Set version to ${version}`)
		return this
	}

	async login(user = LOGIN_ACCOUNT_NAPOLEON) {
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
			throw new Error(`LoginError: ${response?.a?.system?.errror.msg}`)
		}

		this.token = response?.a?.loginMod?.loginAccount?.token
		this.gid = response?.a?.loginMod?.loginAccount?.uid
		this.isLoggedIn = true

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
			throw new Error(response?.a?.system?.errror.msg)
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

	async getEventTourneyLadder() { //Tourney event
		const ladder = await this.sendRequest({ huodong:{ hd254Info:[] }, rsn:'3ekkszzrpf' })

		return ladder.a.cbhuodong.yamenlist
	}
	async getEventVirtueLadder() {
		const ladder = await this.sendRequest({ 'huodong':{ 'hd1078Info':[] },'rsn':'6wxlgspgby' })
		//{name, rid, score, uid}
		return ladder.a.cbhuodong.zizhilist
	}

	/**
	 * Returns the full game infos from player, see types/goat
	 */
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
