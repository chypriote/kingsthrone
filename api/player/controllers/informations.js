
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
		roster: roster.map(h => ({ ...h.hero, quality: h.quality, base: h.hero.quality, id: h.id })),
		rankings: { kingdom, tourney },
	})
}

async function ratio(ctx) {
	const { _limit, _order, _heroes } = ctx.request.query
	const { getPlayersRatio } = strapi.services.player

	const players = await getPlayersRatio(_limit, _order, _heroes)

	ctx.send(players)
}

async function roster(ctx) {
	const { id } = ctx.params
	const { getPlayerHeroes } = strapi.services.player
	const roster = await getPlayerHeroes(id)

	ctx.send(roster.map(h => ({ ...h.hero, quality: h.quality, base: h.hero.quality, id: h.id })))
}

module.exports = {
	index,
	ratio,
	roster,
}
