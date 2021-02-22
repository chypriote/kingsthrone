
async function index(ctx) {
	const { id } = ctx.params
	const { getPlayer, getLatestKingdomRank, getLatestTourneyRank, getAlliance, getPlayerHeroes } = strapi.services.player
	const player = await getPlayer(id)

	if (!player) {
		return ctx.send('Not found', 404)
	}

	const [kingdom, tourney, alliance, roster] = await Promise.all([
		getLatestKingdomRank(player.id),
		getLatestTourneyRank(player.id),
		getAlliance(player.id),
		getPlayerHeroes(player.id),
	])

	ctx.send({
		...player,
		alliance,
		roster: roster.map(h => ({ ...h.hero, quality: h.quality, base: h.hero.quality })),
		rankings: { kingdom, tourney },
	})
}

module.exports = {
	index,
}
