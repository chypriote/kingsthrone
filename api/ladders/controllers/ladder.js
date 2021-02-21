const orderBy = require('lodash/orderBy')

const setPlayerAndAllianceForRanking = async (ranking) => {
	const { getPlayer, getAlliance } = await strapi.services.player
	const [player, alliance] = await Promise.all([getPlayer(ranking.player), getAlliance(ranking.player)])

	return { ...ranking, player, alliance }
}

async function kingdom(ctx) {
	const rankings = await strapi.services.ladder.getKingdom()
	const results = []

	for (const ranking of rankings) {
		results.push(await setPlayerAndAllianceForRanking(ranking))
	}

	ctx.send(orderBy(results, (item) => (item.power ? parseInt(item.power) : 0), 'desc'))
}
async function tourney(ctx) {
	const rankings = await strapi.services.ladder.getTourney()
	const results = []

	for (const ranking of rankings) {
		results.push(await setPlayerAndAllianceForRanking(ranking))
	}

	ctx.send(orderBy(results, (item) => (item.points ? parseInt(item.points) : 0), 'desc'))
}

module.exports = {
	kingdom,
	tourney,
}
