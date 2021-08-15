const fs = require('fs')
const path = require('path')
const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const unzipper = require('unzipper')

async function download(item, event) {
	if (item.indexOf('.zip') === -1) {console.log(`${event} invalid ${item}`); return}

	const folder = path.join('/home/nicolas/Téléchargements/KT', item)
	const file = fs.createWriteStream(folder)

	https.get(`https://ksrclient.gtclientoverseas.com/kings/kingZsjEfun/res/cn_h_kingZsjEfun_act${event}_cn/${item}`, function(response) {
		response.pipe(file)
		console.log(chalk.green(`Downloaded ${item}`))
	})
}

async function resources() {
	const events = [298, 336,1028, 1085,1089, 1091, 1092, 1095, 1123, 1156, 1258, 1276, 1299, 1341]

	for (const event of events) {
		try {
			const list = await axios.get(`https://ksrclient.gtclientoverseas.com/kings/kingZsjEfun/res/cn_h_kingZsjEfun_act${event}_cn/reslist_v31.json`).then(res => res.data)
			if (list.xlist) {
				for (const item of list.xlist) {await download(item[1], event)}
			} else {
				console.log(`no xlist for ${event}`)
			}
		}catch (e) {
			if (e.toString() === 'Error: Request failed with status code 404') {
				console.log(`${event} not found`)
				continue
			}
			console.log(e.toString())
		}
	}
}

resources()
	.then(() => {
		console.log('Finished')
		process.exit()
	})
