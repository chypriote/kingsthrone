import chalk from 'chalk'
import { client, LOGIN_ACCOUNT_701 } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getPlayerByGID, getAllGID, getPlayers } from './repository/player'
import { cleanUpTourney } from './repository/tourney-rankings'
import { cleanUpKingdom } from './repository/kingdom-rankings'
import { Player } from '~/types/Player'

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

	client.setServer('701')
	await client.login(LOGIN_ACCOUNT_701)

	for (let i = 701000001; i < 701005200; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}

	for (const id of missing) {
		try {
			const profile = await client.getProfile(id)

			if (profile && profile.hero_num > 14) {
				await createPlayer(id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, 701)
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


parseProfiles().then(() => process.exit())
