'use strict'

const { sanitizeEntity } = require('strapi-utils')

module.exports = {
	find: async (ctx) => {
		let entities
		if (ctx.query._q) {
			entities = await strapi.services['account-maiden']
				.search(ctx.query, ['account', 'maiden.hero', 'maiden.hero.picture', 'maiden.picture'])
		} else {
			entities = await strapi.services['account-maiden']
				.find(ctx.query, ['account', 'maiden.hero', 'maiden.hero.picture', 'maiden.picture'])
		}

		return entities.map(entity => sanitizeEntity(entity, { model: strapi.models['account-maiden'] }))
	},
}
