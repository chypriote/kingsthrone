import axios from 'axios'
import { Club, Profile, Rank } from '~/types/goat'
import { logger } from '~/scripts/services/logger'

const BASE_SERVER = '699'
const BASE_URL = (server = BASE_SERVER) => `http://zsjefunbm.zwformat.com/servers/s${server}.php`
const COOKIE = 'lyjxncc=61807df8e4b62e93df38a13783e6513b'
const TOKEN = '1b79904280f7e1b2966f88c0f7ea70bc'

const sendRequest = async (data: unknown): Promise<any> => {
	return await axios.post(BASE_URL(), data, {
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
}

export const getProfile = async (gid: number): Promise<Profile> => {
	const profile = await sendRequest({
		user: { getFuserMember: { id: gid } },
		rsn: '5ypfaywvff',
	})

	return profile.a.user.fuser
}

export const getLadder = async (): Promise<Rank[]> => {
	const ladder = await sendRequest({
		rsn:'2ynxlnaqyx',
		ranking:{ paihang:{ type:0 } },
	})

	return ladder.a.ranking.shili
}

export const getAllianceLadder = async (): Promise<Club[]> => {
	const alliances = await sendRequest({
		club:{ clubList:[] },
		rsn:'3zhpsspfrse' }
	)

	return alliances.a.club.clubList
}
