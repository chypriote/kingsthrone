'use strict'

module.exports = {
	load: async (ctx) => {
		const { uid } = ctx.params
		const game = await strapi.services.account.loadAccount(uid)

		return ctx.send(game)
	},
}
