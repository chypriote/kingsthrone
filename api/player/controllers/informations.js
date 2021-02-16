
async function index(ctx) {
	const { id } = ctx.params
	const { getPlayer, getLatestRank, getAlliance } = strapi.services.player
	const player = await getPlayer(id)

	if (!player) {
		return ctx.send('Not found', 404)
	}

	const [rank, alliance] = await Promise.all([getLatestRank(player.id), getAlliance(player.id)])

	ctx.send({ ...player, rank, alliance })
}

module.exports = {
	index,
}
