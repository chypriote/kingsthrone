'use strict'

const { sanitizeEntity } = require('strapi-utils')

module.exports = {
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
	find: async (ctx) => {
		let entities
		if (ctx.query._q) {
			entities = await strapi.services.player
				.search(ctx.query, ['kingdom_rankings', 'tourney_rankings', 'alliance_members', 'player_heroes'])
		} else {
			entities = await strapi.services.player
				.find(ctx.query, ['kingdom_rankings', 'tourney_rankings', 'alliance_members', 'player_heroes'])
		}

		return entities.map(entity => {
			const sanitized = sanitizeEntity(entity, { model: strapi.models.player })
			return { ...sanitized, ratio: sanitized.power / sanitized.heroes }
		})
	},
}
