module.exports = {
	trigger: async (ctx) => {
		const updater = strapi.services.update
		await updater.profiles()

		return ctx.send(null, 204)
	},
	single: async (ctx) => {
		const { id } = ctx.params
		const knex = strapi.connections.default
		const player = (await knex('players')
			.where({ id })
			.limit(1)).pop()

		if (!player) {
			return ctx.send('Not found', 404)
		}

		await strapi.services.player.updateProfile(player)

		return ctx.send(null, 204)
	},
}
