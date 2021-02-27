'use strict'
const differenceInHours = require('date-fns/differenceInHours')
const formatISO = require('date-fns/formatISO')

module.exports = {
	createPlayerKingdomRank: async (rank) => {
		const { logger } = strapi.services
		const knex = strapi.connections.default

		const latest = await strapi.query('kingdom-ranking').findOne({
			player: rank.player,
			_sort: 'date:desc',
		})

		if (latest) {
			const now = new Date()
			const old = new Date(latest.date)

			if (differenceInHours(now, old) < 3) {
				return logger.warn('Player rank already up to date')
			}
		}

		await knex('rankings_kingdom').insert({
			...rank,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
	},
}
