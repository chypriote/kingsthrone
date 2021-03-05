'use strict'

const formatISO = require('date-fns/formatISO')

module.exports = {
	create: async (hero, account) => {
		const logger = strapi.services.logger
		const knex = strapi.connections.default

		await knex('account_heroes')
			.insert({
				...hero,
				created_by: 1,
				updated_by: 1,
				created_at: formatISO(new Date()),
				updated_at: formatISO(new Date()),
				account: account.id,
			})
		logger.debug(`Hero ${hero.hero} created`)
	},
	update: async (hero, account) => {
		const logger = strapi.services.logger
		const knex = strapi.connections.default
		if (!hero.id) {
			throw new Error(`Cant update non existing hero ${JSON.stringify(hero)}`)
		}

		await knex('account_heroes')
			.update({
				level: hero.level,
				quality: hero.quality,
				military: hero.military,
				fortune: hero.fortune,
				provisions: hero.provisions,
				inspiration: hero.inspiration,
				xp_quality: hero.xp_quality,
				xp_tourney: hero.xp_tourney,
				ferocity: hero.ferocity,
				brutality: hero.brutality,
				senior: hero.senior,
				updated_at: formatISO(new Date()),
			})
			.where({ id: hero.id, account: account.id })
		logger.debug(`Hero ${hero.id} updated`)
	},
}
