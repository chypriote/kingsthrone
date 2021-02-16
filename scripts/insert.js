require('dotenv').config()
const fs = require('fs')
const path = require('path')
const client = require('./database')
const logger = require('./logger')
const chalk = require('chalk')
const formatISO = require('date-fns/formatISO')
const {getPlayer, createPlayer, updatePlayer, createPlayerRank} = require('./repository/player');
const {setPlayerAlliance, getPlayerAlliance} = require('./repository/alliance')

async function updatePlayerAlliance(player, ally) {
  //Check if player currently has alliance
  const current = await getPlayerAlliance(player.id)
  if (!current && ally.aid === 0) {return}
  if (!current) { return await setPlayerAlliance(player, ally) }

  //Return if current ally is same
  if (current.aid === ally.aid) { return }
  if (ally.aid === 0) {
    return client('alliance_members')
      .update({active: false})
      .where({player: player.id, leftAt: formatISO(new Date())})
  }

  await client('alliance_members')
    .update({active: false})
    .where({player: player.id, leftAt: formatISO(new Date())})
  await setPlayerAlliance(player, ally)
}

async function insert(file) {
  const now = Date.now()

  const rankings = file.a.ranking.shili

  for (const rank of rankings) {
    logger.log(`Handling ${chalk.bold(rank.name)}`)
    let player = await getPlayer(rank.uid)

    if (!player) {
      await createPlayer(rank.uid, rank.name, rank.vip)
      player = await getPlayer(rank.uid)
    } else if (player.name !== rank.name || player.vip !== rank.vip) {
      await updatePlayer(player, rank.name, rank.vip)
    }

    await Promise.all([
      createPlayerRank({
        date: formatISO(now),
        power: rank.num,
        level: rank.level,
        player: player.id,
      }),
      updatePlayerAlliance(player, {aid: rank.clubid, name: rank.clubname})
    ])
  }
}

async function loadFile(fileName) {
  const filePath = path.resolve(fileName)

  logger.warn(`Reading file "${filePath}"`)
  const file = JSON.parse(fs.readFileSync(filePath))
  await insert(file)

  logger.success(`Finished`)
}

const fileName = process.argv[2]
loadFile(fileName).then(process.exit)
