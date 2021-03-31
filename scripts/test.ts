import { client, LOGIN_ACCOUNT_NAPOLEON, LOGIN_ACCOUNT_RAYMUNDUS } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getAllGID } from './repository/player'

import {
	createForCross,
	getAllianceByAID,
	resetCrossAlliance, setOpponent,
	updateExistingForCross
} from './repository/alliance'
import { chunk } from 'lodash'

const account = LOGIN_ACCOUNT_RAYMUNDUS
const server = 775

export const handleMissing = async (id: number): Promise<void> => {
	try {
		const profile = await client.getProfile(id)

		if (profile && profile.hero_num > 14) {
			await createPlayer(id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, server)
		} else {
			console.log(`Ignoring ${id} ${ profile ? profile.hero_num : ''}`)
		}
	} catch (e) {
		console.log(e, id)
	}
}

export const parseProfiles = async (): Promise<void> => {
	const missing = []
	const gids = (await getAllGID({ server })).map(it => parseInt(it.gid))

	client.setServer(server.toString())
	await client.login(account)
	// await client.login()
	for (let i = 775000001; i < 775005000; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}
	console.log(`found ${missing.length} potential players`)

	const chunkedMissing = chunk(missing, 15)
	for (const missing of chunkedMissing) {
		const promises: Promise<void>[] = []
		missing.forEach(id => { promises.push(handleMissing(id))})
		await Promise.all(promises)
	}

	logger.success('Finished')
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
