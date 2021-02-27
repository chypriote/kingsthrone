const setPlayerAndAllianceForRanking = async (ranking) => {
	const alliance = await strapi.query('alliance').findOne({
		'alliance_members.player': ranking.player.id,
		'alliance_members.active': true,
	})

	return { ...ranking, alliance }
}

async function kingdom(ctx) {
	const latest = await strapi.query('kingdom-ranking').findOne({ _sort: 'date:desc' })
	const rankings = await strapi.query('kingdom-ranking').find({
		date: latest.date,
		_limit: 100,
		_sort: 'power:desc',
		...ctx.request.query,
	})
	const results = []

	for (const ranking of rankings) {
		results.push(await setPlayerAndAllianceForRanking(ranking))
	}

	ctx.send(results)
}
async function tourney(ctx) {
	const latest = await strapi.query('tourney-ranking').findOne({ _sort: 'date:desc' })
	const rankings = await strapi.query('tourney-ranking').find({
		date: latest.date,
		_limit: 100,
		_sort: 'points:desc',
		...ctx.request.query,
	}, ['player.player_heroes'])

	ctx.send(rankings)
}

module.exports = {
	kingdom,
	tourney,
}
