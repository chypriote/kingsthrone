const orderBy = require('lodash/orderBy')

function getRecommendation (player, quality) {
	const ratio = player.power / player.heroes
	let heroesPower = 10
	player.player_heroes.forEach(h => {
		switch (true) {
		case h.quality < quality - 5: heroesPower += 5; break
		case h.quality <= quality + 2: heroesPower += 2; break
		case h.quality < quality + 5: heroesPower -= 2; break
		default: heroesPower -= 5; break
		}
	})
	const hpower = heroesPower/player.player_heroes.length

	return (player.heroes*ratio/1000000) / (hpower*ratio/1000000) + (6 - player.vip) * 2
}

async function index(ctx) {
	const { quality } = ctx.params
	const players = await strapi.query('player')
		.find({
			'player_heroes_null': false,
			'heroes_gte': 15,
		}, ['player_heroes', 'player_heroes.hero'])

	return ctx.send(orderBy(players.map(player => ({
		recommendation: getRecommendation(player, quality),
		ratio: player.power / player.heroes,
		worst: player.player_heroes.filter(h => h.quality <= quality).length,
		even: player.player_heroes.filter(h => h.quality <= quality +3 && h.quality>quality).length,
		best: player.player_heroes.filter(h => h.quality > quality +3).length,
		...player,
	})), 'recommendation', 'desc'))
}

module.exports = {
	index,
}
