'use strict'

const formatISO = require('date-fns/formatISO')

module.exports = {
	create: async (maiden, account) => {
		const logger = strapi.services.logger
		const knex = strapi.connections.default

		await knex('account_maidens')
			.insert({
				...maiden,
				created_by: 1,
				updated_by: 1,
				created_at: formatISO(new Date()),
				updated_at: formatISO(new Date()),
				account: account.id,
			})
		logger.debug(`Maiden ${maiden.maiden} created`)
	},
	update: async (maiden, account) => {
		const logger = strapi.services.logger
		const knex = strapi.connections.default
		if (!maiden.id) {
			throw new Error(`Cant update non existing maiden ${JSON.stringify(maiden)}`)
		}

		await knex('account_maidens')
			.update({
				intimacy: maiden.intimacy,
				charm: maiden.charm,
				experience: maiden.experience,
				updated_at: formatISO(new Date()),
			})
			.where({ id: maiden.id, account: account.id })
		logger.debug(`Maiden ${maiden.id} updated`)
	},
}
