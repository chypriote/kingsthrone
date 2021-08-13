import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'

export const treasureTable = async (): Promise<void> => {
	const status = await goat.events.treasureTable.eventInfos()
	logger.log('---Treasure Table---')

	const outer = status.zhuanpan.lowquan
	const inner = status.zhuanpan.higquan
	if (inner || outer) {
		logger.success(`You have ${inner} inner spin + ${outer} outer spin available`)
	}

	try {
		if (status.zhuanpan.cfg.neirwd.cd.num) {
			await goat.events.treasureTable.spin(1, 1)
			logger.log('Spin free inner wheel')
		}
		if (status.zhuanpan.cfg.wairwd.cd.num) {
			await goat.events.treasureTable.spin(2, 1)
			logger.log('Spin free outer wheel')
		}
	} catch (e) {
		logger.error(e)
	}
}
