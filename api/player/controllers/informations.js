
async function index(ctx) {
	const { id } = ctx.params
	const { getPlayer, getLatestKingdomRank, getAlliance, getHeroes } = strapi.services.player
	const player = await getPlayer(id)

	if (!player) {
		return ctx.send('Not found', 404)
	}

	const [rank, alliance, roster] = await Promise.all([
		getLatestKingdomRank(player.id),
		getAlliance(player.id),
		getHeroes(player.id),
	])

	ctx.send({ ...player, rank, alliance, roster })
}

module.exports = {
	index,
}
