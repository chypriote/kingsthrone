import axios from 'axios'
import { Club, Profile, KingdomRank, TourneyRank } from '~/types/goat'
import { logger } from '../services/logger'

const BASE_SERVER = '699'
const BASE_URL = (server = BASE_SERVER) => `http://zsjefunbm.zwformat.com/servers/s${server}.php`
const COOKIE = 'lyjxncc=2083c99339e8b46bf500d2d46ae68581'
const TOKEN = '6f850b4853f1b0e61a78b42461c48609'

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
	const profile = await sendRequest({
		user: { getFuserMember: { id: gid } },
		rsn: '5ypfaywvff',
	})

	return profile.a.user.fuser
}

export const getKingdomRankings = async (): Promise<KingdomRank[]> => {
	const ladder = await sendRequest({
		rsn:'2ynxlnaqyx',
		ranking:{ paihang:{ type:0 } },
	})

	return ladder.a.ranking.shili
}

export const getTourneyRankings = async (): Promise<TourneyRank[]> => {
	const tourney = await sendRequest(
		{ yamen:{ getrank:[] }, rsn:'8jaaovjikee' }
	)

	return tourney.a.yamen.rank
}

export const getAllianceLadder = async (): Promise<Club[]> => {
	const alliances = await sendRequest({
		club:{ clubList:[] },
		rsn:'3zhpsspfrse' }
	)

	return alliances.a.club.clubList
}
