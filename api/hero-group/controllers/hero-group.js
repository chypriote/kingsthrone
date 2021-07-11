'use strict'

const { sanitizeEntity } = require('strapi-utils')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	find: async (ctx) => {
		let entities
		if (ctx.query._q) {
			entities = await strapi.services['hero-group']
				.search(ctx.query, ['heroes.picture', 'heroes.maiden', 'heroes.maiden.picture', 'heroes.skins'])
		} else {
			entities = await strapi.services['hero-group']
				.find(ctx.query, ['heroes.picture', 'heroes.maiden', 'heroes.maiden.picture', 'heroes.skins'])
		}

		return entities
			.map(entity => sanitizeEntity(entity, { model: strapi.models['hero-group'] }))
	},
}
