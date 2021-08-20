import {
	logAllianceSiege,
	logCoronation,
	logDailyAllianceShop,
	logDivining,
	logTreasureHunt
} from './record-events/index'
import { goat } from 'kingsthrone-api'
import { client } from '~/scripts/services/database'
import { fromUnixTime } from 'date-fns'

export const eventByIdAndDateExists = async ({ id, sTime }: { id: number, sTime: number }): Promise<boolean> => {
	const test = await client('events')
		.where({ eid: id, start: fromUnixTime(sTime) })
		.limit(1)

	return test.length > 0
}
const logEvents = async () => {
	await goat.profile.getGameInfos()
	// await logDivining()
	// await logCoronation()
	// await logAllianceSiege()
	// await logDailyAllianceShop()
}
logEvents().then(() => { process.exit()})
