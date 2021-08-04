'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	find: async (ctx) => {
		let entities
		if (ctx.query._q) {
			entities = await strapi.services.server.search({ _limit: 5000, ...ctx.query })
		} else {
			entities = await strapi.services.server.find({ _limit: 5000, ...ctx.query })
		}

		return entities.map(s => ({ id: s.id, merger: s.merger }))
	},
	mergers: async () => {
		const knex = strapi.connections.default
		return (await knex('servers')
			.select('merger')
			.whereNot('merger', '=', 0)
			.groupBy('merger')
			.orderBy('merger')).map(m => m.merger)
	},
}
