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
	getPlayerHeroes: async (player) => {
		return strapi.query('player-hero').find({ player }, ['hero', 'hero.picture'])
	},
	getPlayersRatio: async (limit = 0, order = 'asc', heroes = 0) => {
		const knex = strapi.connections.default
		let query = `select *, div(players.power, players.heroes) as ratio from players ${heroes ? `where players.heroes > ${heroes} ` : ''}order by ratio ${order} limit ${limit ? limit : 100}`

		const result = await knex.raw(query)
		return result.rows
	},
}
