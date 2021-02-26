const orderBy = require('lodash/orderBy')

async function index(ctx) {
	const { quality } = ctx.params
	const players = await strapi.query('player')
		.find({
			'player_heroes_null': false,
			'heroes_gte': 15,
		}, ['player_heroes', 'player_heroes.hero'])

	return ctx.send(orderBy(players.map(player => ({
		ratio: player.power / player.heroes,
		worst: player.player_heroes.filter(h => h.quality <= quality).length,
		even: player.player_heroes.filter(h => h.quality <= quality +3 && h.quality>quality).length,
		best: player.player_heroes.filter(h => h.quality > quality +3).length,
		...player,
	})), ['worst', 'favorite', 'ratio', 'event'], ['desc', 'desc', 'asc', 'desc']))
}

module.exports = {
	index,
}
