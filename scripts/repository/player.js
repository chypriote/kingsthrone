const client = require('../database')
const logger = require('../logger')
const formatISO = require('date-fns/formatISO')
const differenceInHours = require('date-fns/differenceInHours')

async function createPlayer(gid, name, vip) {
  await client('players').insert({
    gid, name, vip,
    created_by: 1,
    updated_by: 1,
    created_at: formatISO(new Date()),
    updated_at: formatISO(new Date()),
  });
  logger.debug(`Player created`)
}

async function getPlayer(gid) {
  const players = await client('players')
    .where('gid', '=', gid)
    .limit(1)

  return players.length ? players[0] : null
}

async function updatePlayer(player, name, vip) {
  await client('players')
    .where({ gid: player.gid })
    .update({ name, vip })
  logger.debug(`Player updated`)
}

async function getLatestRank(player) {
  const rankings = await client('rankings')
    .where('player', '=', player)
    .orderBy('date', 'desc')
    .limit(1)

  return rankings.length ? rankings[0] : null
}

async function createPlayerRank(rank) {
  const latest = await getLatestRank(rank.player)
  if (latest) {
    const now = new Date()
    const old = new Date(latest.date)

    if (!differenceInHours(now, old)) {
      return logger.warn(`Player rank already up to date`)
    }
  }

  await client('rankings').insert({
    ...rank,
    created_by: 1,
    updated_by: 1,
    created_at: formatISO(new Date()),
    updated_at: formatISO(new Date()),
  })
  logger.debug(`Rank saved`)
}

module.exports = {
  createPlayer,
  updatePlayer,
  getPlayer,
  createPlayerRank,
}
