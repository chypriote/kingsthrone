const chalk = require('chalk')
const chunk = require('lodash/chunk')
const formatISO = require('date-fns/formatISO')

module.exports = {
	alliances: async () => {
		const { goat, logger, alliance } = strapi.services
		const clubs = await goat.getAllianceLadder()

		for (const club of clubs) {
			logger.log(`Handling ${chalk.bold(club.name)}`)
			const aid = parseInt(club.id)
			const existing = await strapi.query('alliance').findOne({ aid })

			existing ? await alliance.updateAlliance(alliance, club) : await alliance.createAlliance(club)
		}
		logger.success('Alliances finished')
	},
	kingdom: async () => {
		const { goat, logger, player } = strapi.services
		const kingdom = strapi.services['kingdom-ranking']
		const now = Date.now()
		const rankings = await goat.getKingdomRankings()

		for (const rank of rankings) {
			logger.log(`Updating ${chalk.bold(rank.name)}  kingdom rank`)
			const profile = await player.getOrCreatePlayerFromGoat(rank)

			await kingdom.createPlayerKingdomRank({
				player: profile.id,
				date: formatISO(now),
				power: rank.num,
				level: rank.level,
				rank: rank.rid,
			})
		}

		logger.success('Finished')
	},
	tourney: async () => {
		const { goat, logger, player } = strapi.services
		const tourney = strapi.services['tourney-ranking']
		const now = Date.now()
		const rankings = await goat.getTourneyRankings()

		for (const rank of rankings) {
			logger.log(`Updating ${chalk.bold(rank.name)}  tourney rank`)
			const profile = await player.getOrCreatePlayerFromGoat(rank)

			await tourney.createPlayerTourneyRank({
				player: profile.id,
				date: formatISO(now),
				rank: rank.rid,
				points: rank.num,
				ratio: profile.power / profile.heroes,
			})
		}

		logger.success('Finished')
	},
	profiles: async () => {
		const { goat, logger, player } = strapi.services
		await goat.login()
		const profiles = await strapi.connections.default('players').where({ server: 699 })

		const chunks = chunk(profiles, 8)

		for (const chunk of chunks) {
			const promises = []
			chunk.forEach((profile) => promises.push(player.updateProfile(profile)))
			await Promise.all(promises)
			await new Promise(resolve => setTimeout(resolve, 1000))
		}

		logger.success('Finished')
	},
}
