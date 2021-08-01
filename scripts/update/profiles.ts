import { config } from 'dotenv'
config()
import { chunk } from 'lodash'
import { differenceInHours } from 'date-fns'
import { goat, UserProfile } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { checkInactivity, getPlayers, updatePlayerDetails } from '../repository/player'
import { getPlayerAlliance, leaveAlliance, setPlayerAlliance } from '../repository/alliance'
import { Player } from '../../types/strapi/Player'

export const updatePlayerAlliance = async (player: Player, ally: UserProfile): Promise<void> => {
	//Check if player currently has alliance
	const current = await getPlayerAlliance(player)

	//Return if no current and club is 0
	if (!current && ally.clubid == '0') {
		return
	}
	//Add Alliance if no previous
	if (!current) {
		return await setPlayerAlliance(player, ally)
	}
	//Return if current ally is same
	if (current.aid == ally.clubid) {
		return
	}
	//Leave if new alliance is 0
	if (ally.clubid == '0') {
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
		if (differenceInHours(new Date(), new Date(profile.updated_at)) < 12) { return console.log(`returning ${differenceInHours(new Date(), new Date(profile.updated_at))}`) }
		const item = await goat.profile.getUser(profile.gid)
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
	const players: Player[] = await getPlayers()
	const chunks = chunk(players, 9)

	for (const chunk of chunks) {
		const promises: Promise<void>[] = []
		chunk.forEach((player: Player) => promises.push(updateProfile(player)))
		await Promise.all(promises)
		await new Promise(resolve => setTimeout(resolve, 1000))
	}

	logger.success('Finished')
}
