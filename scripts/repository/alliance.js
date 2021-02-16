const client = require('../services/database')
const logger = require('../services/logger')
const formatISO = require('date-fns/formatISO')

async function createAlliance(
	aid,
	name,
	power = 0,
	reputation = 0,
	level = 0,
	motto = null
) {
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

async function updateAlliance(
	aid,
	name,
	power = null,
	reputation = null,
	level = null,
	motto = null
) {
	await client('alliances').update({
		name,
		power,
		reputation,
		level,
		motto,
		updated_at: formatISO(new Date()),
	}).where('aid', '=', aid)
	logger.debug('Alliance created')
}

async function getAllianceByAID(aid) {
	const alliances = await client('alliances')
		.where('aid', '=', aid)
		.limit(1)

	return alliances.length ? alliances[0] : null
}

async function getPlayerAlliance(id) {
	const members = await client('alliance_members as am')
		.select('alliances.id', 'alliances.name', 'alliances.aid')
		.join('alliances', 'am.alliance', 'alliances.id')
		.where({ player: id, active: true })
		.limit(1)

	return members.length ? members[0] : null
}

// Checks if sent alliance already exists and creates it if not, add player to alliance
async function setPlayerAlliance(player, ally) {
	logger.debug(`Joining alliance ${ally.name}`)
	let alliance = await getAllianceByAID(ally.aid)
	if (!alliance) {
		await createAlliance(ally.aid, ally.name)
		alliance = await getAllianceByAID(ally.aid)
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

module.exports = {
	createAlliance,
	updateAlliance,
	getAllianceByAID,
	getPlayerAlliance,
	setPlayerAlliance,
}
