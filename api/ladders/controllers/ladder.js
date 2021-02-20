const orderBy = require('lodash/orderBy')

async function kingdom(ctx) {
	const { getAll, getLatestKingdomRank, getAlliance } = strapi.services.player
	const players = await getAll()
	const rankings = []

	for (const player of players) {
		const [rank, alliance] = await Promise.all([getLatestKingdomRank(player.id), getAlliance(player.id)])

		rankings.push({ ...rank, player, alliance })
	}

	ctx.send(orderBy(rankings, (item) => (item.power ? parseInt(item.power) : 0), 'desc'))
}
async function tourney(ctx) {
	const { getAll, getLatestTourneyRank, getAlliance } = strapi.services.player
	const players = await getAll()
	const rankings = []

	for (const player of players) {
		const [rank, alliance] = await Promise.all([getLatestTourneyRank(player.id), getAlliance(player.id)])

		rankings.push({ ...rank, player, alliance })
	}

	ctx.send(orderBy(rankings, (item) => (item.points ? parseInt(item.points) : 0), 'desc'))
}

module.exports = {
	kingdom,
	tourney,
}
