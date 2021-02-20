import { config } from 'dotenv'
config()
import chalk from 'chalk'
import formatISO from 'date-fns/formatISO'
import { KingdomRank } from '~/types/goat'
import { Player } from '~/types/types'
import { logger } from './services/logger'
import { getKingdomRankings } from './services/requests'
import { createPlayerKingdomRank, getOrCreatePlayerFromGoat } from './repository/player'
import { getPlayerAlliance, leaveAlliance, setPlayerAlliance } from './repository/alliance'

async function updatePlayerAlliance(player: Player, ally: KingdomRank) {
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
	const rankings = await getKingdomRankings()

	for (const rank of rankings) {
		logger.log(`Handling ${chalk.bold(rank.name)}`)
		const player = await getOrCreatePlayerFromGoat(rank)

		await Promise.all([
			createPlayerKingdomRank({
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
