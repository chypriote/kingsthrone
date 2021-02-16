require('dotenv').config()
const fs = require('fs')
const path = require('path')
const logger = require('./services/logger')
const chalk = require('chalk')
const { getAllianceByAID, updateAlliance, createAlliance } = require('./repository/alliance')

async function updateAlliances(file) {
	const clubs = file.a.club.clubList

	for (const club of clubs) {
		logger.log(`Handling ${chalk.bold(club.name)}`)
		let alliance = await getAllianceByAID(club.id)

		if (!alliance) {
			await createAlliance(club.id, club.name, club.allShiLi, club.fund, club.level, club.outmsg)
		} else {
			await updateAlliance(club.id, club.name, club.allShiLi, club.fund, club.level, club.outmsg)
		}
	}
}

async function loadFile(fileName) {
	const filePath = path.resolve(fileName)

	logger.warn(`Reading file "${filePath}"`)
	const file = JSON.parse(fs.readFileSync(filePath))
	await updateAlliances(file)

	logger.success('Finished')
}

const fileName = process.argv[2]
loadFile(fileName).then(process.exit)
