import { chunk } from 'lodash'
import { client } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getAllGID, getPlayerByGID, updatePlayerDetails } from './repository/player'
import { updatePlayerAlliance } from './profiles'
import { Player } from '../types/Player'
import { Profile } from '../types/goat'

const SERVERS = [
	'691',
	'692',
	'693',
	'694',
	'695',
	'696',
	'697',
	'698',
	'699',
]

const getMin = (server: string): number => parseInt(server + '000001')
const getMax = (server: string): number => parseInt(server + '005000')

export const createPlayerIfExists = async (profile: Profile): Promise<Player> => {
	const gid = parseInt(profile.id)
	await createPlayer(gid, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, parseInt(client.server))

	logger.success(`Created ${profile.name}`)
	return await getPlayerByGID(gid)
}

export const handleGID = async (id: number, retry = true): Promise<string|null> => {
	try {
		let player: Player|null = await getPlayerByGID(id)
		const profile = await client.getProfile(id)

		if (!profile || profile.hero_num < 15 || !profile.clubid) {
			console.log(`Ignoring ${id} ${ profile ? profile.hero_num : ''}`)
			return null
		}
		if (!player) {
			player = await createPlayerIfExists(profile)
		}

		await Promise.all([
			updatePlayerDetails(player, profile),
			updatePlayerAlliance(player, profile),
		])
		logger.success(`Updated ${profile.name}`)

		return player.name
	} catch (e) {
		if (retry && e.message.indexOf('server_is_busyuser') > -1) {
			logger.debug(`waiting ${id}`)
			await new Promise(resolve => setTimeout(resolve, 2000))
			logger.debug(`retrying ${id}`)

			return await handleGID(id, false)
		}
		console.log(e.message)
	}

	return null
}

export const deathmatch = async (): Promise<void> => {
	for (const server of SERVERS) {
		console.log(server)
		client.isLoggedIn = false
		client.setServer(server)
		await client.login()
		// await client.createAccount(server)

		const missing = []
		const gids = (await getAllGID({ server })).map(it => parseInt(it.gid))
		for (let i = getMin(server); i < getMax(server); i++) {
			if (gids.includes(i)) {continue}
			missing.push(i)
		}
		console.log(`found ${missing.length} potential players`)

		const chunkedMissing = chunk(missing, 10)
		let created: (string|null)[] = []
		for (const missing of chunkedMissing) {
			const promises: Promise<string|null>[] = []
			missing.forEach(id => { promises.push(handleGID(id))})
			created = await Promise.all(promises)
		}

		logger.success(created.filter(Boolean).join(', '))
		logger.success(`Finished ${missing.length}`)
	}
}

deathmatch().then(() => process.exit())
