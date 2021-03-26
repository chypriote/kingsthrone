import { config } from 'dotenv'
config()
import { chunk } from 'lodash'
import { Profile } from '~/types/goat'
import { logger } from './services/logger'
import { client, LOGIN_ACCOUNT_RAYMUNDUS } from './services/requests'
import { getPlayers, updatePlayerDetails } from './repository/player'
import { getPlayerAlliance, leaveAlliance, setPlayerAlliance } from './repository/alliance'
import { checkInactivity } from './repository/player'
import { Player } from '~/types/Player'

const updatePlayerAlliance = async (player: Player, ally: Profile): Promise<void> => {
	//Check if player currently has alliance
	const current = await getPlayerAlliance(player)

	//Return if no current and club is 0
	if (!current && ally.clubid === 0) {
		return
	}
	//Add Alliance if no previous
	if (!current) {
		return await setPlayerAlliance(player, ally)
	}
	//Return if current ally is same
	if (parseInt(String(current.aid)) === ally.clubid) {
		return
	}
	//Leave if new alliance is 0
	if (ally.clubid === 0) {
		logger.error(`${player.name} left alliance ${ally.clubname}`)
		return await leaveAlliance(player)
	}
	//Leave and join new if clubid changed
	await leaveAlliance(player)
	await setPlayerAlliance(player, ally)
}

const updateProfile = async (profile: Player): Promise<void> => {
	logger.debug(`Updating ${profile.name}`)
	try {
		const item = await client.getProfile(profile.gid)
		if (!item) {return}

		await Promise.all([
			updatePlayerDetails(profile, item),
			updatePlayerAlliance(profile, item),
		])
		await checkInactivity(profile)
	} catch (e) {
		logger.error(`Error updating ${profile.gid} (${profile.name}): ${e.toString()}`)
	}
}

export const updateProfiles = async (): Promise<void> => {
	client.setServer('775')
	await client.login(LOGIN_ACCOUNT_RAYMUNDUS)
	const players: Player[] = await getPlayers({ server: 775 })
	const chunks = chunk(players, 9)

	for (const chunk of chunks) {
		const promises: Promise<void>[] = []
		chunk.forEach((player: Player) => promises.push(updateProfile(player)))
		await Promise.all(promises)
		await new Promise(resolve => setTimeout(resolve, 1000))
	}

	logger.success('Finished')
}

updateProfiles().then(() => process.exit())
