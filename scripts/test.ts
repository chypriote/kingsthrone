import chalk from 'chalk'
import { Player } from '~/types/strapi'
import { client } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getPlayerByGID, getAllGID, getPlayers } from './repository/player'
import { cleanUpTourney } from './repository/tourney-rankings'
import { cleanUpKingdom } from './repository/kingdom-rankings'

export const findMissingPlayers = async (): Promise<void> => {
	const players = await client.getEventTourneyLadder()

	for (const player of players) {
		const gid = parseInt(player.uid)
		const found = getPlayerByGID(gid)
		if (found) { continue }

		await createPlayer(gid, player.name)
	}

	logger.success('Finished')
}

export const parseProfiles = async (): Promise<void> => {
	const missing = []
	const gids = (await getAllGID()).map(it => parseInt(it.gid))

	for (let i = 699000001; i < 699005058; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}

	for (const id of missing) {
		try {
			const profile = await client.getProfile(id)
			if (profile && profile.hero_num > 14) {
				await createPlayer(id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num)
			}
		} catch (e) {
			console.log(e, id)
		}
	}

	logger.success('Finished')
}

export const cleanUpRank = async (): Promise<void> => {
	const players: Player[] = await getPlayers()
	for (const player of players) {
		const [kingdom, tourney] = await Promise.all([
			cleanUpKingdom(player),
			cleanUpTourney(player),
		])
		logger.success(`Deleted ${kingdom} kingdom and ${tourney} tourney for ${chalk.bold(player.name)}`)
	}
}


cleanUpRank().then(() => process.exit())
