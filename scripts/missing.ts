import { chunk } from 'lodash'
import { goat } from 'kingsthrone-api'
import { UserProfile } from 'kingsthrone-api/lib/types/User'
import { logger } from './services/logger'
import { checkInactivity, createPlayer, getAllGID, getPlayerByGID, updatePlayerDetails } from './repository/player'
import { updatePlayerAlliance } from './update/profiles'
import { Player } from '../types/strapi/Player'
import { differenceInHours } from 'date-fns'

const SERVERS = ['699']
const getMin = (server: string): number => parseInt(server + '000001')
const getMax = (server: string): number => parseInt(server + '005500')

const createPlayerIfExists = async (profile: UserProfile): Promise<Player> => {
	const gid = profile.id
	await createPlayer(gid, profile.name, profile.vip, profile.shili, profile.hero_num, parseInt(goat._getServer()))

	logger.success(`Created ${profile.name}`)
	return await getPlayerByGID(gid)
}

const handleGID = async (id: string, retry = true): Promise<string|null> => {
	try {
		let profile: Player|null = await getPlayerByGID(id)
		if (profile && differenceInHours(new Date(), new Date(profile.updated_at)) < 12) { return null }
		const item = await goat.profile.getUser(id)

		if (!item || item.hero_num < 15) {
			logger.debug(`Ignoring ${id} ${ item ? item.hero_num : ''}`)
			return null
		}
		if (!profile) {
			profile = await createPlayerIfExists(item)
		}

		await Promise.all([
			updatePlayerDetails(profile, item),
			updatePlayerAlliance(profile, item),
		])
		await checkInactivity(profile)

		return profile.name
	} catch (e) {
		if (!e.message) {logger.error(e.toString()); return null}

		if (retry && e.message.indexOf('server_is_busyuser') > -1) {
			await new Promise(resolve => setTimeout(resolve, 2000))

			return await handleGID(id, false)
		}
		logger.alert(e.message)
	}

	return null
}

export const missing = async (): Promise<void> => {
	for (const server of SERVERS) {
		await goat.profile.getGameInfos()
		const missing = []
		const gids = (await getAllGID({ server })).map(it => parseInt(it.gid))
		for (let i = getMin(server); i < getMax(server); i++) {
			if (gids.includes(i)) {continue}
			missing.push(i)
		}

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
