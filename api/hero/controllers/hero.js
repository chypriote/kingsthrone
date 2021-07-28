'use strict'

const { sanitizeEntity } = require('strapi-utils')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#controllers)
 * to customize this controller
 */

module.exports = {
	find: async (ctx) => {
		let entities
		if (ctx.query._q) {
			entities = await strapi.services.hero
				.search(ctx.query, [
					'hero_groups',
					'hero_groups.paragons',
					'picture',
					'skins',
					'quality_skills',
					'paragons',
				])
		} else {
			entities = await strapi.services.hero
				.find(ctx.query, [
					'hero_groups',
					'hero_groups.paragons',
					'picture',
					'skins',
					'quality_skills',
					'paragons',
				])
		}

		return entities
			.map(entity => sanitizeEntity(entity, { model: strapi.models.hero }))
	},
	findOne: async (ctx) => {
		const { id } = ctx.params

		const params = isNaN(id) ? { slug: id.toLowerCase() } : { id }
		const entity = await strapi.services.hero.findOne(params)

		return sanitizeEntity(entity, { model: strapi.models.hero })
	},
}
