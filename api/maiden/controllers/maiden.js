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
		const entity = await strapi.services.maiden.findOne(params)

		return sanitizeEntity(entity, { model: strapi.models.maiden })
	},
}
