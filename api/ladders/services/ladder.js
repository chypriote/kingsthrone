'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
	getKingdom: async (limit = 0) => {
		const knex = strapi.connections.default
		const ranks = await knex('rankings_kingdom').orderBy('date', 'desc').limit(1)
		const latest = ranks[0]

		const qb = knex('rankings_kingdom').where({ date: latest.date })

		return limit ? await qb.limit(limit) : await qb
	},

	getTourney: async (limit = 0) => {
		const knex = strapi.connections.default
		const ranks = await knex('rankings_tourney').orderBy('date', 'desc').limit(1)
		const latest = ranks[0]

		const qb = knex('rankings_tourney').where({ date: latest.date })

		return limit ? await qb.limit(limit) : await qb
	},
}
