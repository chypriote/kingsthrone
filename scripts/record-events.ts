import { logPicnic, logTreasureHunt } from './record-events/index'
import { goat } from 'kingsthrone-api'

const logEvents = async () => {
	await goat.profile.getGameInfos()
	await logPicnic()
	await logTreasureHunt()
}
logEvents().then(() => { process.exit()})
