const client = require('../database')
const logger = require('../logger')
const formatISO = require('date-fns/formatISO')

async function createAlliance(aid, name, power) {
  await client('alliances').insert({
    aid, name, power,
    created_by: 1,
    updated_by: 1,
    created_at: formatISO(new Date()),
    updated_at: formatISO(new Date()),
  });
  logger.debug(`Alliance created`)
}

async function getPlayerAlliance(id) {
  const members = await client('alliance_members as am')
    .select('alliances.id', 'alliances.name', 'alliances.aid')
    .join('alliances', 'am.alliance', 'alliances.id')
    .where({ player: id, active: true})
    .limit(1)

  return members.length ? members[0] : null
}

async function getAlliance(aid) {
  const alliances = await client('alliances')
    .where('aid', '=', aid)
    .limit(1)

  return alliances.length ? alliances[0] : null
}

// Checks if sent alliance already exists and creates it if not, add player to alliance
async function setPlayerAlliance(player, ally) {
  let alliance = await getAlliance(ally.aid)
  if (!alliance) {
    await createAlliance(ally.aid, ally.name, 0)
    alliance = await getAlliance(ally.aid)
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
  setPlayerAlliance,
  getAlliance,
  getPlayerAlliance,
}
