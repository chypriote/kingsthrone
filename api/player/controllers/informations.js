
async function index(ctx) {
	const { id } = ctx.params
	const { getPlayer, getLatestKingdomRank, getLatestTourneyRank, getAlliance, getHeroes } = strapi.services.player
	const player = await getPlayer(id)

	if (!player) {
		return ctx.send('Not found', 404)
	}

	const [kingdom, tourney, alliance, roster] = await Promise.all([
		getLatestKingdomRank(player.id),
		getLatestTourneyRank(player.id),
		getAlliance(player.id),
		getHeroes(player.id),
	])

	ctx.send({ ...player, alliance, roster, rankings: { kingdom, tourney } })
}

module.exports = {
	index,
}
