const orderBy = require('lodash/orderBy')

async function index(ctx) {
	const { getAll, getLatestRank, getAlliance } = strapi.services.player
	const players = await getAll()
	const rankings = []

	for (const player of players) {
		const [rank, alliance] = await Promise.all([getLatestRank(player.id), getAlliance(player.id)])

		if (player.name === 'Sero the Unruly') {
			console.log(alliance);
		}
		rankings.push({ ...rank, player, alliance })
	}

	ctx.send(orderBy(rankings, (item) => parseInt(item.power), 'desc'))
}

module.exports = {
	index,
}
