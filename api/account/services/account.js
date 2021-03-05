'use strict'
const differenceInHours = require('date-fns/differenceInHours')
const formatISO = require('date-fns/formatISO')

module.exports = {
	loginWithUid: async (uid) => {
		const knex = strapi.connections.default
		const { goat } = strapi.services
		const account = await strapi.query('account').findOne({ uid })

		if (!account) {
			throw new Error(`User ${uid} not found`)
		}

		const loginAccount = await goat.login(account.parameters, uid)
		await knex('accounts').update({
			token: loginAccount.token,
			last_login: formatISO(new Date()),
		}).where({ uid })
	},
	loadAccount: async (uid) => {
		const { goat, account } = strapi.services
		const user = await strapi.query('account').findOne({ uid })

		if (!user) {
			throw new Error(`User ${uid} not found`)
		}

		if (!user.last_login || differenceInHours(new Date(), new Date(user.last_login)) > 3) {
			await account.loginWithUid(uid)
		}

		const game = await goat.sendRequest({ rsn:'2ynbmhanlb',guide:{ login:{ language:1,platform:'gaotukc',ug:'' } } }, uid)

		return game.a
	},
}
