import { config } from 'dotenv'
config()
import { chunk } from 'lodash'
import { Player } from '~/types/types'
import { logger } from './services/logger'
import { getProfile } from './services/requests'
import { getPlayers, updatePlayerDetails } from './repository/player'

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
	const chunks = chunk(players, 9)
	for (const chunk of chunks) {
		const promises: Promise<void>[] = []
		chunk.forEach((player: Player) => promises.push(updateProfile(player)))
		await Promise.all(promises)
		await new Promise(resolve => setTimeout(resolve, 1000))
	}

	logger.success('Finished')
}

updateProfiles().then(() => process.exit())
