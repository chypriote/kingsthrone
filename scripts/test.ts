import { goat, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { client } from './services/database'
import { logger } from './services/logger'
import { createPlayer, getAllGID, getPlayerByGID } from './repository/player'
import { createForCross, getAllianceByAID, resetCrossAlliance, setOpponent, updateExistingForCross } from './repository/alliance'
import { chunk, orderBy } from 'lodash'

const account = LOGIN_ACCOUNT_NAPOLEON
const server = 691

export const handleMissing = async (id: string, retry = true): Promise<string|null> => {
	try {
		const profile = await goat.getProfile(id)

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

	goat.setServer(server.toString())
	await goat.login(account)
	for (let i = 691000001; i < 691005000; i++) {
		if (gids.includes(i)) {continue}
		missing.push(i)
	}
	console.log(`found ${missing.length} potential players`)

	const chunkedMissing = chunk(missing, 10)
	let created: (string|null)[] = []
	for (const missing of chunkedMissing) {
		const promises: Promise<string|null>[] = []
		missing.forEach(id => { promises.push(handleMissing(id.toString()))})
		created = await Promise.all(promises)
	}

	logger.success(created.filter(Boolean).join(', '))
	logger.success(`Finished ${missing.length}`)
}

export const crossServerAlliances = async (): Promise<void> => {
	const alliances = await goat.getXSAlliances()
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
		const opponents = await goat.getCrossOpponents(6990001)
		for (const opponent of opponents) {
			await setOpponent(opponent)
		}
	}
}

export const crossServerTourney = async (): Promise<void> => {
	const players = await goat.getXSTourney()

	for (const player of players) {
		const existing = await getPlayerByGID(player.uid)

		if (existing) { logger.log(`Existing ${player.name}`); continue }
		const profile = await goat.getXSPlayer(player.uid)
		await createPlayer(profile.id, profile.name, profile.vip, parseInt(profile.shili), profile.hero_num, parseInt(profile.id.toString().substr(0, 3)))
	}

	logger.success('Finished')
}

// parseProfiles().then(() => process.exit())


const logDeathmatch = async (): Promise<void> => {
	const users = (await goat.dmGetRankings()).scorelist
	const opponents = []

	await client('players').update({ cross: false })

	for (const user of users) {
		if (user.uid == goat.gid) { continue }
		const existing = await getPlayerByGID(user.uid)
		const profile = await goat.getXSPlayer(user.uid)
		const ratio = Math.round(parseInt(profile.shili) / profile.hero_num)

		await client('players')
			.where({ gid: user.uid })
			.update({ cross: true, ratio: ratio })

		opponents.push({
			gid: existing.gid,
			name: existing.name,
			power: profile.shili,
			heroes: profile.hero_num,
			vip: existing.vip,
			ratio: ratio,
		})
	}

	console.log(JSON.stringify(orderBy(opponents, 'ratio', 'asc')))
}
