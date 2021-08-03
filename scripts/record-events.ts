import { logDIYStore, logScratchAndWin } from './record-events/index'

const logEvents = async () => {
	// await logTreasureHunt()
	// await logPicnic()
	await logDIYStore()
	await logScratchAndWin()
}
logEvents().then(() => { process.exit()})
