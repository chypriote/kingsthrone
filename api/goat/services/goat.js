const axios = require('axios')
const logger = require('../../logger/services/logger')

const COOKIE = 'lyjxncc=2083c99339e8b46bf500d2d46ae68581'
const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'4cfhvxxiim','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f','parm3':'SM-G955F','openid':'563125632849524101','openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706' } } }
const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'3hewzzhpsp','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'2f12d907-56a9-3a46-9124-d4351e9fc878','parm3':'SM-G955F','openid':'565939577188654916','openkey':'51ba25dcc6757726dec6ba4c737e3ca134c49fb3' } } }

class GoatRequest {
	cookie
	token = null
	server
	base_url

	isLoggedIn = false

	constructor(server = '699', cookie = COOKIE) {
		this.cookie = cookie
		this.server = server
		this.base_url = `http://zsjefunbm.zwformat.com/servers/s${server}.php`
	}

	setServer(server) {
		this.server = server
		return this
	}

	async login(user = LOGIN_ACCOUNT_NAPOLEON) {
		console.log('logging in')
		const response = await axios.post(this.base_url, user, {
			params: {
				sevid: this.server,
				ver: 'V1.3.519',
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

	async sendRequest(data, gid = '699005053') {
		if (!this.isLoggedIn) {await this.login()}

		const response =  await axios.post(this.base_url, data, {
			params: {
				sevid: this.server,
				ver: 'V1.3.519',
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

	async getProfile(gid)  {
		const profile = await this.sendRequest({ user: { getFuserMember: { id: gid } },rsn: '5ypfaywvff' })

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
