import { logCoronation } from './record-events/index'

const logEvents = async () => {
	await logCoronation()
}
logEvents().then(() => { process.exit()})
