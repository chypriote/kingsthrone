module.exports = {
	trigger: async (ctx) => {
		const { goat, update } = strapi.services

		await goat.login()
		await Promise.all([
			update.kingdom(),
			update.tourney(),
			update.alliances(),
		])
		await update.profiles()

		return ctx.send(null, 204)
	},
	player: async (ctx) => {
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
	alliances: async (ctx) => {
		await strapi.services.update.alliances()

		return ctx.send(null, 204)
	},
	kingdom: async (ctx) => {
		await strapi.services.update.kingdom()

		return ctx.send(null, 204)
	},
	tourney: async (ctx) => {
		await strapi.services.update.tourney()

		return ctx.send(null, 204)
	},
	profiles: async (ctx) => {
		await strapi.services.update.profiles()

		return ctx.send(null, 204)
	},
}
