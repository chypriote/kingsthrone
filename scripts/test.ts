import chalk from 'chalk'
import { client, LOGIN_ACCOUNT_701 } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getAllGID, getPlayers } from './repository/player'
import { cleanUpTourney } from './repository/tourney-rankings'
import { cleanUpKingdom } from './repository/kingdom-rankings'
import { Player } from '~/types/Player'

export const parseProfiles = async (): Promise<void> => {
	const missing = []
	const gids = (await getAllGID()).map(it => parseInt(it.gid))

	// client.setServer('701')
	// await client.login(LOGIN_ACCOUNT_701)
	await client.login()
	for (let i = 699000000; i < 699001000; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}
	console.log(`found ${missing.length} potential players`)
	for (const id of missing) {
		try {
			const profile = await client.getProfile(id)

			if (profile && profile.hero_num > 14) {
				await createPlayer(id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, 699)
			} else {
				console.log(`Ignoring ${id}`)
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
