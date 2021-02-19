import { config } from 'dotenv'
import { chunk } from 'lodash-es'
import { Player } from '~/types/types'
import { logger } from './services/logger'
import { getProfile } from './services/requests'
import { getPlayers, updatePlayerDetails } from './repository/player'

config()

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

	logger.success('Finished')
}

updateProfiles().then(() => process.exit())
