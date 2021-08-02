import { logPicnic, logTreasureHunt } from './record-events/index'

const logEvents = async () => {
	// await logTreasureHunt()
	// await logPicnic()
}
logEvents().then(() => { process.exit()})
