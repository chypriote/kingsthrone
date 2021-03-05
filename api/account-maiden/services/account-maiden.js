'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */
const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'4cfhvxxiim','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'fe3da078-88a4-3ccf-9249-5acf33d7765f','parm3':'SM-G955F','openid':'563125632849524101','openkey':'9fa3348fcd6344060431a81d44a219d2c0a3a706' } } }

module.exports = {
	getMaidenVisits: async () => {
		const { goat } = strapi.services
		await goat.login(LOGIN_ACCOUNT_GAUTIER)
		const maidens = await goat.sendRequest({ 'user':{ 'refwife':[] },'rsn':'3hesfzewkf' }, '699002934')

		return maidens.a.wife.jingLi
	},
	getRandomVisit: async () => {
		const { goat } = strapi.services
		await goat.login(LOGIN_ACCOUNT_GAUTIER)
		const visit = await goat.sendRequest({ 'wife':{ 'sjxo':[] },'rsn':'5jwwvvjaffr' }, '699002934')

		return visit.u.wife.wifeList[0]
	},
}
