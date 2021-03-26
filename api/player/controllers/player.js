'use strict'

const { sanitizeEntity } = require('strapi-utils')

module.exports = {
	find: async (ctx) => {
		let entities
		if (ctx.query._q) {
			entities = await strapi.services.player
				.search(ctx.query, ['alliance_members', 'alliance_members.alliance'])
		} else {
			entities = await strapi.services.player
				.find(ctx.query, ['alliance_members', 'alliance_members.alliance'])
		}

		return entities
			.map(entity => sanitizeEntity(entity, { model: strapi.models.player }))
			.map(entity => {
				const alliances = entity.alliance_members.filter(member => !member.leftAt)
				return { ...entity, alliance: alliances.length ? (alliances.pop()).alliance : null }
			})
	},
	details: async (ctx) => {
		const { id } = ctx.params
		const knex = strapi.connections.default
		const player = (await knex('players')
			.where({ id })
			.limit(1)).pop()

		if (!player) {
			return ctx.send('Not found', 404)
		}

		const [alliance, roster] = await Promise.all([
			strapi.query('alliance').findOne({ 'alliance_members.player': player.id, 'alliance_members.active': true }),
			strapi.query('player-hero').find({ player: player.id }, ['hero', 'hero.picture']),
		])

		ctx.send({
			...player,
			alliance,
			roster: roster.map(h => ({ ...h.hero, quality: h.quality, base: h.hero.quality, id: h.id, hero: h.hero.id })),
		})
	},
	roster: async (ctx) => {
		const { id } = ctx.params
		const roster = await strapi.query('player-hero').find({ player: id }, ['hero', 'hero.picture'])

		ctx.send(roster.map(h => ({ ...h.hero, quality: h.quality, base: h.hero.quality, id: h.id })))
	},
}
