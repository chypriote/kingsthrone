import { client } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getPlayerByGID } from './repository/player'

export const findMissingPlayers = async (): Promise<void> => {
	const players = await client.getEventTourneyLadder()

	for (const player of players) {
		const gid = parseInt(player.uid)
		const found = getPlayerByGID(gid)
		if (found) {continue}

		await createPlayer(gid, player.name)
	}

	logger.success('Finished')
}

findMissingPlayers().then(() => process.exit())
