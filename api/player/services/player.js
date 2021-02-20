'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
	getAll: async () => {
		const knex = strapi.connections.default

		return await knex('players')
	},
	getPlayer: async (player) => {
		const knex = strapi.connections.default
		const players = await knex('players')
			.where('id', '=', player)
			.limit(1)

		return players.length ? players[0] : null
	},
	getLatestKingdomRank: async (player) => {
		const knex = strapi.connections.default
		const rankings = await knex('rankings_kingdom')
			.where('player', '=', player)
			.orderBy('date', 'desc')
			.limit(1)

		return rankings.length ? rankings[0] : null
	},
	getLatestTourneyRank: async (player) => {
		const knex = strapi.connections.default
		const rankings = await knex('rankings_tourney')
			.where('player', '=', player)
			.orderBy('date', 'desc')
			.limit(1)

		return rankings.length ? rankings[0] : null
	},
	getAlliance: async (player) => {
		const knex = strapi.connections.default
		const alliances = await knex('alliances')
			.select('alliances.*')
			.join('alliance_members as am', 'am.alliance', 'alliances.id')
			.where('am.active', '=', true)
			.andWhere('am.player', '=', player)
			.limit(1)

		return alliances.length ? alliances[0] : null
	},
}
