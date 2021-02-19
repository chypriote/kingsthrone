import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { Club } from '~/types/goat'
import { logger } from './services/logger'
import { createAlliance, getAllianceByAID, updateAlliance } from './repository/alliance'

config()

async function updateAlliances(clubs: Club[]) {
	for (const club of clubs) {
		logger.log(`Handling ${chalk.bold(club.name)}`)
		const aid = parseInt(club.id)
		const alliance = await getAllianceByAID(aid)

		if (!alliance) {
			logger.debug(`Alliance ${aid} (${club.name}) not found`)
			await createAlliance(
				aid,
				club.name,
				club.allShiLi,
				parseInt(club.fund),
				parseInt(club.level),
				club.outmsg
			)
		} else {
			await updateAlliance(
				aid,
				club.name,
				club.allShiLi,
				parseInt(club.fund),
				parseInt(club.level),
				club.outmsg
			)
		}
	}
}

async function loadFile(fileName: string) {
	const filePath = path.resolve(fileName)

	logger.warn(`Reading file "${filePath}"`)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const file = JSON.parse(fs.readFileSync(filePath))
	await updateAlliances(file.a.club.clubList)

	logger.success('Finished')
}

const fileName = process.argv[2]
loadFile(fileName).then(() => process.exit)
