/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { Goat } from './goat'
import { logger } from './logger'

export const LOGIN_ACCOUNT_NAPOLEON: LoginData = { 'rsn':'2axwqwhxyx','login':{ 'loginAccount':{
	'parm1':'WIFI','platform':'gaotukc',
	'parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15',
	'parm3':'ONEPLUS A5000','openid':'565939577188654916',
	'openkey':'b4d47e9c7beaf15e97f899c8cd4f2bbc4f31c3bc' } } }

interface LoginData {
	rsn: string
	login: {
		loginAccount: {
			parm1: string
			platform: string
			parm2: string
			parm6: string
			parm3: string
			openkey: string
			openid: string
		}
	}
}

export class GoatResource {
	_goat: Goat
	_data: string|null = null

	constructor(goat: Goat) {
		this._goat = goat
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async _jsonResponseHandler(response: any): Promise<any> {
		if (response?.a?.system?.errror) {
			throw new Error(response?.a?.system?.errror.msg || JSON.stringify(response))
		}
		if (response?.a?.system?.version) {
			this._goat._setVersion(response.a.system.version.ver)
			return await this._retry()
		}
		this._data = null

		return response
	}

	private _makeParams(): any {
		return {
			sevid: this._goat._getServer(),
			ver: this._goat._getVersion(),
			uid: this._goat.isLoggedIn ? this._goat._getGid() : '',
			token: this._goat.isLoggedIn ? this._goat._getToken() : '',
			platform: 'gaotukc',
			lang: 'en',
		}
	}
	private _makeHeaders(): any {
		return {
			'Accept-Encoding': 'identity',
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; ONEPLUS A5000 Build/NMF26X)',
			'Host': this._goat._getHost(),
			'Cookie': this._goat._getCookie(),
			'Connection': 'Keep-Alive',
		}
	}
	private async _retry (): Promise<any> {
		if (!this._data) { throw new Error('Nothing to retry') }
		return await this._request(this._data)
	}
	private async _request(data: any = null): Promise<any> {
		const makeRequest = async (data: string) => {
			if (!this._data) {this._data = data}

			return await axios.post(
				this._goat._getBaseUrl(),
				data,
				{
					params: this._makeParams(),
					headers: this._makeHeaders(),
				}).then(response => response.data)
		}

		return await makeRequest(JSON.stringify(data || {}))
	}

	public async login(user: LoginData): Promise<void> {
		const response = await this._request(user)

		if (!response?.a?.loginMod?.loginAccount?.token) {
			logger.error(`LoginError: ${response?.a?.system?.errror.msg}`)
		}

		this._goat._setToken(response?.a?.loginMod?.loginAccount?.token)
		this._goat._setGid(response?.a?.loginMod?.loginAccount?.uid.toString())
		logger.warn(`Logged in on ${this._goat._getServer()} as ${this._goat._getGid()}`)
	}
	protected async request(data: any = null): Promise<any> {
		if (!this._goat.isLoggedIn) { await this.login(LOGIN_ACCOUNT_NAPOLEON) }
		const response = await this._request(data)
		return await this._jsonResponseHandler(response)
	}
}

