import { logAlchemy } from './record-events/index'

const logEvents = async () => {
	await logAlchemy()
}
logEvents().then(() => { process.exit()})
