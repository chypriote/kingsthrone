import { formatISO, fromUnixTime } from 'date-fns'
import { Profile, XSAlliance, XSOpponent } from '~/types/goatGeneric'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { Alliance } from '~/types/strapi/Alliance'
import { Player } from '~/types/strapi/Player'

export const createAlliance = async (
	aid: number,
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
	aid: number,
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

export const getAllianceByAID = async (aid: number): Promise<Alliance> => {
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
export const setPlayerAlliance = async (player: Player, ally: Profile): Promise<void> => {
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

export const resetCrossAlliance = async (): Promise<void> => {
	await client('alliances')
		.update({ cross: false, opponent: false })
}

export const updateExistingForCross = async (existing: Alliance, alliance: XSAlliance): Promise<Alliance> => {
	await client('alliances')
		.update({
			power: alliance.allShiLi,
			cross: true,
			wins: alliance.win,
			updated_at: formatISO(new Date()),
		})
		.where({ aid: existing.aid })

	return await getAllianceByAID(existing.aid)
}
export const createForCross = async (alliance: XSAlliance): Promise<Alliance> => {
	await client('alliances')
		.insert({
			aid: alliance.cid,
			name: alliance.cname,
			power: alliance.allShiLi,
			server: alliance.sev,
			cross: true,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
	return await getAllianceByAID(alliance.cid)
}

export const setOpponent = async (opponent: XSOpponent): Promise<void> => {
	await client('alliances')
		.update({
			opponent: true,
			battletime: formatISO(fromUnixTime(opponent.time)),
		}).where({ aid: opponent.fcid })
}
