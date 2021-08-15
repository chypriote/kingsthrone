const fs = require('fs')
const path = require('path')
const axios = require('axios')
const chalk = require('chalk')

async function download(item, event) {
	if (item.indexOf('.zip') === -1) {console.log(`${event} invalid ${item}`); return}

	const folder = path.join('/home/nicolas/Téléchargements/KT', item)
	const file = fs.createWriteStream(folder)

	return axios
		.get(`https://ksrclient.gtclientoverseas.com/kings/kingZsjEfun/res/cn_h_kingZsjEfun_act${event}_cn/${item}`, { responseType: 'stream' })
		.then(response => {

			return new Promise((resolve, reject) => {
				response.data.pipe(file)
				let error = null
				file.on('error', err => {
					error = err
					file.close()
					reject(err)
				})
				file.on('close', () => {
					if (!error) { resolve(true) }
				})
				console.log(chalk.green(`Downloaded ${item}`))
			})
		})
}

async function resources() {
	const events = [1250]

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
