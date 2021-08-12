import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'

export const treasureTable = async (): Promise<void> => {
	const status = await goat.events.treasureTable.eventInfos()
	logger.log('---Treasure Table---')

	const outer = status.zhuanpan.lowquan
	const inner = status.zhuanpan.higquan
	logger.success(`You have ${inner} inner spin available`)
	if (outer > 0) {
		await goat.events.treasureTable.spin(1, outer)
		logger.log('Spin outer wheel')
	}
}
