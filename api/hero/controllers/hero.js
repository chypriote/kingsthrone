'use strict'

const { sanitizeEntity } = require('strapi-utils')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#controllers)
 * to customize this controller
 */

module.exports = {
	findOne: async (ctx) => {
		const { id } = ctx.params

		const params = isNaN(id) ? { slug: id.toLowerCase() } : { id }
		const entity = await strapi.services.hero.findOne(params, [
			'hero_group.paragons',
			'hero_group.paragons.item',
			'hero_group.paragons.item.picture',
			'hero_group.paragons.hero_groups',
			'picture',
			'skins',
			'skins.picture',
			'quality_skills',
			'quality_skills.skins',
			'quality_skills.skins.picture',
			'paragons',
			'paragons.picture',
			'paragons.item',
			'paragons.item.picture',
			'maiden',
			'maiden.picture',
			'maiden.maiden_bonds',
		])

		return sanitizeEntity(entity, { model: strapi.models.hero })
	},
}
