import { config } from 'dotenv'
import chalk from 'chalk'
import formatISO from 'date-fns/formatISO'
import { Rank } from '~/types/goat'
import { Player } from '~/types/types'
import { logger } from './services/logger'
import { getLadder } from './services/requests'
import { createPlayer, createPlayerRank, getPlayerByGID, updatePlayer } from './repository/player'
import { getPlayerAlliance, leaveAlliance, setPlayerAlliance } from './repository/alliance'

config()

async function updatePlayerAlliance(player: Player, ally: Rank) {
	//Check if player currently has alliance
	const current = await getPlayerAlliance(player)
	if (!current && ally.clubid === 0) {
		return
	}
	if (!current) {
		return await setPlayerAlliance(player, ally)
	}

	//Return if current ally is same
	if (parseInt(String(current.aid)) === ally.clubid) {
		return
	}
	if (ally.clubid === 0) {
		logger.error(player.id, 'Left alliance')
		return await leaveAlliance(player)
	}

	await leaveAlliance(player)
	await setPlayerAlliance(player, ally)
}

async function updateLadder() {
	const now = Date.now()
	const rankings = await getLadder()

	for (const rank of rankings) {
		logger.log(`Handling ${chalk.bold(rank.name)}`)
		const uid = parseInt(rank.uid)
		let player = await getPlayerByGID(uid)

		if (!player) {
			await createPlayer(uid, rank.name, rank.vip)
			player = await getPlayerByGID(uid)
		} else if (player.name !== rank.name || player.vip !== rank.vip) {
			await updatePlayer(player, rank.name, rank.vip)
		}

		await Promise.all([
			createPlayerRank({
				player,
				date: formatISO(now),
				power: rank.num,
				level: rank.level,
				rank: rank.rid,
			}),
			updatePlayerAlliance(player, rank),
		])
	}

	logger.success('Finished')
}

updateLadder().then(() => process.exit())
