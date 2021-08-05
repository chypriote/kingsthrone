import axios from 'axios'
import { chunk } from 'lodash'
import { differenceInHours, fromUnixTime } from 'date-fns'
import { User } from 'kingsthrone-api'
import { Goat } from 'kingsthrone-api/lib'
import { UserProfile } from 'kingsthrone-api/lib/types/User'
import { Player } from '../types/strapi/Player'
import { logger } from './services/logger'
import { client } from './services/database'
import { updatePlayerAlliance } from './update/profiles'
import { checkInactivity, createPlayer, getPlayerByGID, updatePlayerDetails } from './repository/player'

const getServer = (gid: string): string => {
	switch (gid.length) {
	case 7: return gid.toString().substr(0, 1)
	case 8: return gid.toString().substr(0, 2)
	case 10: return gid.toString().substr(0, 4)
	case 9:
	default:
		return gid.toString().substr(0, 3)
	}
}

const createPlayerFromProfile = async (profile: UserProfile): Promise<Player> => {
	const gid = profile.id
	await createPlayer(
		gid,
		profile.name,
		profile.vip,
		profile.shili,
		profile.hero_num,
		getServer(gid)
	)

	logger.success(`Created ${profile.name} (${gid}) on ${getServer(gid)}`)
	return await getPlayerByGID(gid)
}
const handleUser = async (user: User, goat: Goat): Promise<void> => {
	let player: Player|null = await getPlayerByGID(user.uid)
	const profile = await goat.profile.getUser(user.uid)

	if (!profile) { return }
	if (player && differenceInHours(new Date(), new Date(player.updated_at)) < 3) { return }
	if (!player) {
		player = await createPlayerFromProfile(profile)
	}

	await Promise.all([
		updatePlayerDetails(player, profile),
		updatePlayerAlliance(player, profile),
	])
	await checkInactivity(player)
	logger.success(`Updated ${profile.name}`)
}
const recordServerLadder = async (server: string): Promise<void> => {
	try {
		const goat = new Goat()
		goat._setServer(server)
		await goat.account.createAccount(server)

		const ranks = await goat.rankings.getLadderKP(true)

		for (const user of ranks) {
			await handleUser(user, goat)
		}
	} catch (e) {
		logger.error(`Error on server ${server}: ${e.toString()}`)
	}
}

/** Get all existing servers and add missing ones */
interface GoatServer {
	he: number
	id: number
	name: string
	showtime: number
	state: number
	skin: number
	url: string
}
const getAllServers = async (): Promise<GoatServer[]> => {
	const servers = await axios.post(
		'http://ksrus.gtbackoverseas.com/serverlist.php?platform=gaotukc&lang=1',
		{ platform: 'gaotukc', lang: 1 },
		{
			headers: {
				'Accept-Encoding': 'identity',
				'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; ONEPLUS A5000 Build/NMF26X)',
				'Content-Length': 0,
				'Content-Type': 'application/x-www-form-urlencoded',
				Connection: 'Keep-Alive',
				Host: 'ksrus.gtbackoverseas.com',
			},
		})
		.then((response) => response.data)
	return servers.a.system.server_list
}
const createMissingServers = async () => {
	const existing = (await client('servers').select('id')).map((sv) => sv.id.toString())
	const servers = await getAllServers()

	for (const server of servers) {
		if (existing.includes(server.id.toString())) {
			continue
		}
		await client('servers').insert({
			id: server.id,
			name: server.name,
			time: fromUnixTime(server.showtime),
			merger: server.he,
		})
		logger.success(`Created server ${server.id}`)
	}
}

/** Update every server's ladder */
const logServers = async (): Promise<void> => {
	await createMissingServers()
	const servers = (await client('servers')
		.min('id')
		.groupBy('merger')
		.orderBy('min')).map(sv => sv.min)

	const chunks: number[][] = chunk(servers, 20)
	for (const ck of chunks) {
		const promises = []
		for (const server of ck) {
			promises.push(recordServerLadder(server.toString()))
		}
		await Promise.all(promises)
	}

	await axios.post(process.env.NETLIFY_HOOK || '')
}

logServers().then(() => {process.exit()})
