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

export const parseProfiles = async (): Promise<void> => {
	const missing = []

	for (let i = 699004999; i < 699005000; i++) {
		const player = await getPlayerByGID(i)
		if (!player) {
			missing.push(i)
		 }
	}

	for (const id of missing) {
		try {
			const profile = await client.getProfile(id)
			if (profile && profile.hero_num > 14) {
				await createPlayer(id, profile.name, profile.vip, profile.shili, profile.hero_num)
			}
		} catch (e) {
			console.log(e, id)
		}
	}

	logger.success('Finished')
}

parseProfiles().then(() => process.exit())
