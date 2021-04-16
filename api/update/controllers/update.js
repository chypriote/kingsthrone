module.exports = {
	trigger: async (ctx) => {
		const { goat, update } = strapi.services

		await goat.login()
		await update.alliances()
		await update.profiles()

		return ctx.send(null, 204)
	},
	player: async (ctx) => {
		const { gid } = ctx.params
		const knex = strapi.connections.default
		const player = (await knex('players')
			.where({ gid })
			.limit(1)).pop()

		if (!player) {
			return ctx.send('Not found', 404)
		}

		await strapi.services.player.updateProfile(player)

		return ctx.send(null, 204)
	},
	alliances: async (ctx) => {
		await strapi.services.update.alliances()

		return ctx.send(null, 204)
	},
	profiles: async (ctx) => {
		await strapi.services.update.profiles()

		return ctx.send(null, 204)
	},
}
