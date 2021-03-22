import chalk from 'chalk'
import { client, LOGIN_ACCOUNT_RAYMUNDUS } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getAllGID, getPlayers } from './repository/player'
import { cleanUpTourney } from './repository/tourney-rankings'
import { cleanUpKingdom } from './repository/kingdom-rankings'
import { Player } from '~/types/Player'
import {
	createForCross,
	getAllianceByAID,
	resetCrossAlliance, setOpponent,
	updateExistingForCross
} from './repository/alliance'

export const parseProfiles = async (): Promise<void> => {
	const missing = []
	const gids = (await getAllGID({ server: 775 })).map(it => parseInt(it.gid))

	client.setServer('775')
	await client.login(LOGIN_ACCOUNT_RAYMUNDUS)
	// await client.login()
	for (let i = 775003000; i < 775004000; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}
	console.log(`found ${missing.length} potential players`)
	for (const id of missing) {
		try {
			const profile = await client.getProfile(id)

			if (profile && profile.hero_num > 14) {
				await createPlayer(id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, 775)
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

export const crossServerAlliances = async (): Promise<void> => {
	const alliances = await client.getXSAlliances()
	await resetCrossAlliance()

	for (const alliance of alliances) {
		let ally
		const existing = await getAllianceByAID(alliance.cid)

		if (existing) {
			ally = await updateExistingForCross(existing, alliance)
			console.log(`Alliance ${ally.name} updated for crossserver`)
		} else {
			ally = await createForCross(alliance)
			console.log(`Alliance ${ally.name} added to crossserver`)
		}
		const opponents = await client.getCrossOpponents(6990001)
		for (const opponent of opponents) {
			await setOpponent(opponent)
		}
	}
}

parseProfiles().then(() => process.exit())
