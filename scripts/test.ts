import { client, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'
import { createPlayer, getAllGID, getPlayerByGID } from './repository/player'
import { createForCross, getAllianceByAID, resetCrossAlliance, setOpponent, updateExistingForCross } from './repository/alliance'
import { chunk } from 'lodash'

const account = LOGIN_ACCOUNT_NAPOLEON
const server = 699

export const handleMissing = async (id: number, retry = true): Promise<string|null> => {
	try {
		const profile = await client.getProfile(id)

		if (profile && profile.hero_num > 14) {
			await createPlayer(id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, server)
			return profile.name
		} else {
			console.log(`Ignoring ${id} ${ profile ? profile.hero_num : ''}`)
		}
	} catch (e) {
		if (retry && e.message.indexOf('server_is_busyuser') > -1) {
			logger.debug(`waiting ${id}`)
			await new Promise(resolve => setTimeout(resolve, 2000))
			logger.debug(`retrying ${id}`)

			return await handleMissing(id, false)
		}
		console.log(e.message)
	}
	return null
}

export const parseProfiles = async (): Promise<void> => {
	const missing = []
	const gids = (await getAllGID({ server })).map(it => parseInt(it.gid))

	client.setServer(server.toString())
	await client.login(account)
	for (let i = 699000500; i < 699005000; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}
	console.log(`found ${missing.length} potential players`)

	const chunkedMissing = chunk(missing, 10)
	let created: (string|null)[] = []
	for (const missing of chunkedMissing) {
		const promises: Promise<string|null>[] = []
		missing.forEach(id => { promises.push(handleMissing(id))})
		created = await Promise.all(promises)
	}

	logger.success(created.filter(Boolean).join(', '))
	logger.success(`Finished ${missing.length}`)
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

export const crossServerTourney = async (): Promise<void> => {
	const players = await client.getXSTourney()

	for (const player of players) {
		const existing = await getPlayerByGID(player.uid)

		if (existing) { logger.log(`Existing ${player.name}`); continue }
		const profile = await client.getXSPlayer(player.uid)
		await createPlayer(profile.id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, parseInt(profile.id.toString().substr(0, 3)))
	}

	logger.success('Finished')
}

parseProfiles().then(() => process.exit())
