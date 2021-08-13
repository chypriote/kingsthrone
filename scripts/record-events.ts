import { logDragonSlaying, logJewelsOfLuck, logPeoplesMonarch, logSparksUnderMoonlight } from './record-events/index'
import { goat } from 'kingsthrone-api'

const logEvents = async () => {
	await goat.profile.getGameInfos()
	// await logDragonSlaying()
	// await logPeoplesMonarch()
	await logJewelsOfLuck()
	// await logSparksUnderMoonlight()
}
logEvents().then(() => { process.exit()})
