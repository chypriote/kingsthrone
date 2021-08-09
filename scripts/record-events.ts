import { logGardenStroll, logPathOfWealth } from './record-events/index'

const logEvents = async () => {
	await logGardenStroll()
	await logPathOfWealth()
}
logEvents().then(() => { process.exit()})
