import { config } from 'dotenv'
import axios, { AxiosResponse } from 'axios'
import { chunk } from 'lodash-es'
import { Profile } from '~/types/goat'
import { Player } from '~/types/types'
import { logger } from './services/logger'
import { getPlayers, updatePlayerDetails } from './repository/player'

config()

const BASE_URL = 'http://zsjefunbm.zwformat.com/servers/s699.php'

const getProfile = async (gid: number): Promise<Profile> => {
	const profile = await axios.post(BASE_URL, {
		user: { getFuserMember: { id: gid } },
		rsn: '5ypfaywvff',
	}, {
		params: {
			sevid: '699',
			ver: 'V1.3.497',
			uid: '699002934',
			token: '1b79904280f7e1b2966f88c0f7ea70bc',
			platform: 'gaotukc',
			lang: 'en',
		},
		headers: {
			'Accept-Encoding': 'identity',
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; SM-G955F Build/NRD90M)',
			'Host': 'zsjefunbm.zwformat.com',
			'Cookie': 'lyjxncc=61807df8e4b62e93df38a13783e6513b',
			'Connection': 'Keep-Alive',
		},
	}).then((response: AxiosResponse) => response.data)

	return profile.a.user.fuser
}

const updateProfile = async (player: Player): Promise<void> => {
	logger.debug(`Updating ${player.name}`)
	try {
		const profile = await getProfile(player.gid)

		return updatePlayerDetails(player, profile)
	} catch (e) {
		logger.error(`Error updating ${player.gid} (${player.name}): ${e.toString()}`)
	}
}

const updateProfiles = async () => {
	const players: Player[] = await getPlayers()
	const chunks = chunk(players, 50)
	for (const chunk of chunks) {
		const promises: Promise<void>[] = []
		chunk.forEach((player: Player) => promises.push(updateProfile(player)))
		await Promise.all(promises)
	}
}

updateProfiles().then(() => process.exit)
