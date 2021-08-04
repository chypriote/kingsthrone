import { formatISO } from 'date-fns'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { Alliance } from '~/types/strapi/Alliance'
import { Player } from '~/types/strapi/Player'
import { UserProfile } from 'kingsthrone-api'

export const createAlliance = async (
	aid: string,
	name: string,
	power = 0,
	reputation = 0,
	level = 0,
	motto: string|null = null
): Promise<void> => {
	await client('alliances').insert({
		aid,
		name,
		power,
		reputation,
		level,
		motto,
		created_by: 1,
		updated_by: 1,
		created_at: formatISO(new Date()),
		updated_at: formatISO(new Date()),
	})
	logger.debug('Alliance created')
}

export const updateAlliance = async (
	aid: string,
	name: string,
	power = 0,
	reputation = 0,
	level = 0,
	motto: string|null = null
): Promise<void> => {
	await client('alliances').update({
		name,
		power,
		reputation,
		level,
		motto,
		updated_at: formatISO(new Date()),
	}).where('aid', '=', aid)
	logger.debug('Alliance updated')
}

export const getAllianceByAID = async (aid: string): Promise<Alliance> => {
	const alliances = await client('alliances')
		.where('aid', '=', aid)
		.limit(1)

	return alliances.length ? alliances[0] : null
}

export const getPlayerAlliance = async (player: Player): Promise<Alliance> => {
	const members = await client('alliance_members as am')
		.select('alliances.id', 'alliances.name', 'alliances.aid')
		.join('alliances', 'am.alliance', 'alliances.id')
		.where({ player: player.id, active: true })
		.limit(1)

	return members.length ? members[0] : null
}

// Checks if sent alliance already exists and creates it if not, add player to alliance
export const setPlayerAlliance = async (player: Player, ally: UserProfile): Promise<void> => {
	logger.success(`Joining alliance ${ally.clubname}`)
	let alliance = await getAllianceByAID(ally.clubid)
	if (!alliance) {
		await createAlliance(ally.clubid, ally.clubname)
		alliance = await getAllianceByAID(ally.clubid)
	}

	await client('alliance_members')
		.insert({
			alliance: alliance.id,
			player: player.id,
			active: true,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
}

export const leaveAlliance = async (player: Player): Promise<void> => {
	await client('alliance_members')
		.update({ active: 0, leftAt: formatISO(new Date()), updated_at: formatISO(new Date()) })
		.where({ player: player.id })
}
