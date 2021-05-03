const chalk = require('chalk')
const chunk = require('lodash/chunk')

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
	profiles: async () => {
		const { logger, player } = strapi.services
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
