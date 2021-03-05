'use strict'

const formatISO = require('date-fns/formatISO')
const reduce = require('lodash/reduce')

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

		await account.loginWithUid(uid)
		const game = await goat.sendRequest({ rsn:'2ynbmhanlb',guide:{ login:{ language:1,platform:'gaotukc',ug:'' } } }, uid)

		await Promise.all([
			account.saveHeroes(game.a.hero.heroList, user),
			account.saveMaidens(game.a.wife.wifeList, user),
		])

		return game.a
	},
	saveHeroes: async (heroList, account) => {
		const heroService = strapi.services['account-hero']

		for (const goatHero of heroList) {
			const [heroModel, existing] = await Promise.all([
				strapi.query('hero').findOne({ hid: goatHero.id }),
				strapi.query('account-hero').findOne({ 'hero.hid': goatHero.id, account: account.id }),
			])

			const stats = goatHero.aep
			const brutality = goatHero.pkskill.find(it => it.id === 2)?.level || 0
			const ferocity = goatHero.pkskill.find(it => it.id === 1)?.level || 0
			const quality = reduce(goatHero.epskill, (q, skill) => q + skill.zz, 0)

			const myHero = {
				hero: heroModel.id,
				level: goatHero.level,
				quality: quality,
				military: stats.e1,
				fortune: stats.e2,
				provisions: stats.e3,
				inspiration: stats.e4,
				xp_quality: goatHero.zzexp,
				xp_tourney: goatHero.pkexp,
				ferocity: ferocity,
				brutality: brutality,
				senior: goatHero.senior,
			}

			if (existing && existing.id) {
				await heroService.update({ ...myHero, id: existing.id }, account)
			} else {
				await heroService.create(myHero, account)
			}
		}
	},
	saveMaidens: async (wifeList, account) => {
		const maidenService = strapi.services['account-maiden']

		for (const goatMaiden of wifeList) {
			const [maidenModel, existing] = await Promise.all([
				strapi.query('maiden').findOne({ mid: goatMaiden.id }),
				strapi.query('account-maiden').findOne({ 'maiden.mid': goatMaiden.id, account: account.id }),
			])

			const myMaiden = {
				maiden: maidenModel.id,
				intimacy: goatMaiden.love,
				charm: goatMaiden.flower,
				experience: goatMaiden.exp,
			}

			if (existing && existing.id) {
				await maidenService.update({ ...myMaiden, id: existing.id }, account)
			} else {
				await maidenService.create(myMaiden, account)
			}
		}
	},
}
