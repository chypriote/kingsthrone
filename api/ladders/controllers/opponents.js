const orderBy = require('lodash/orderBy')
const reduce = require('lodash/reduce')

const calculateRecommendation = (player, quality) => {
	const roster = player.player_heroes
	const bonus_quality = reduce(roster, (bonus, h) => parseInt(bonus) + parseInt(quality) - parseInt(h.quality), 0)
	const bonus_power = Math.ceil(player.power / 1000000)

	return player.heroes //Nombre de héros
		+ bonus_quality - ((player.heroes - roster.length) * 5) //Diff de qualité entre le roster et le héros
		- bonus_power //Malus pour la puissance du roster
		+ (player.inactive ? 5 : 0)
}

async function index(ctx) {
	const { quality } = ctx.params

	const players = await strapi.query('player').find({ 'heroes_gte': 15, ...ctx.query }, ['player_heroes', 'player_heroes.hero'])

	return ctx.send(orderBy(players.map(player => ({
		ratio: player.power / player.heroes,
		worst: player.player_heroes.filter(h => h.quality <= quality).length,
		even: player.player_heroes.filter(h => h.quality <= quality +3 && h.quality>quality).length,
		best: player.player_heroes.filter(h => h.quality > quality +3).length,
		total_quality: reduce(player.player_heroes, (tq, h) => tq + h, 0),
		rating: calculateRecommendation(player, quality),
		...player,
		inactive: player.inactive ? 2 : (player.inactive === null ? 1 : 0),
	})), ['rating', 'worst', 'favorite', 'inactive', 'ratio', 'event', 'vip'], ['desc', 'desc', 'desc', 'desc', 'asc', 'desc', 'asc']))
}

module.exports = {
	index,
}
