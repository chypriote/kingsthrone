import { chunk } from 'lodash'
import { goat } from './services/goat'
import { logger } from './services/logger'
import { createPlayer, getAllGID, getPlayerByGID, updatePlayerDetails } from './repository/player'
import { updatePlayerAlliance } from './update/profiles'
import { Player } from '../types/strapi/Player'
import { UserProfile } from '~/types/goat/User'

const SERVERS = ['696']

const getMin = (server: string): number => parseInt(server + '000001')
const getMax = (server: string): number => parseInt(server + '005000')

const createPlayerIfExists = async (profile: UserProfile): Promise<Player> => {
	const gid = profile.id
	await createPlayer(gid, profile.name, profile.vip, profile.shili, profile.hero_num, parseInt(goat._getServer()))

	logger.success(`Created ${profile.name}`)
	return await getPlayerByGID(gid)
}

const handleGID = async (id: string, retry = true): Promise<string|null> => {
	try {
		let player: Player|null = await getPlayerByGID(id)
		const profile = await goat.profile.getUser(id)

		if (!profile || profile.hero_num < 15) {
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

export const missing = async (): Promise<void> => {
	for (const server of SERVERS) {
		console.log(server)
		goat.isLoggedIn = false
		await goat.account.createAccount(server)

		const missing = []
		const gids = (await getAllGID({ server })).map(it => parseInt(it.gid))
		for (let i = getMin(server); i < getMax(server); i++) {
			if (gids.includes(i)) {continue}
			missing.push(i)
		}
		console.log(`found ${missing.length} potential players`)

		const chunkedMissing = chunk(missing, 8)
		let created: (string|null)[] = []
		for (const missing of chunkedMissing) {
			const promises: Promise<string|null>[] = []
			missing.forEach(id => { promises.push(handleGID(id.toString()))})
			created = await Promise.all(promises)
		}

		logger.success(created.filter(Boolean).join(', '))
		logger.success(`Finished ${missing.length}`)
	}
}

missing().then(() => {process.exit()})
