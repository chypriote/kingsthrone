import { logger } from '../services/logger'
import { goat } from 'kingsthrone-api'
import { PicnicStatus } from 'kingsthrone-api/lib/types/Events'
import { find } from 'lodash'

const claimQuests = async (status: PicnicStatus): Promise<void> => {
	try {
		for (const task of status.task.tasks) {
			const todo = find(status.task.taskscfg, cfg => cfg.type == task.id)
			if (!todo) { continue }
			const goal = find(todo.dcCfg, g => g.id === task.rwd)
			if (!goal || goal.max > task.num) { continue }

			await goat.events.picnic.claimQuest(task.id)
			console.log(`Claiming reward for task ${task.id}`)
			status.info.quan++
		}
	} catch (e) {
		logger.error(`Quests ${e.toString()}`)
	}
}

const havePicnic = async (status: PicnicStatus): Promise<void> => {
	try {
		const todo = Math.trunc(status.info.quan / 9)
		for (let i = 0; i < todo; i++) {
			await goat.events.picnic.picnic(10)
			console.log('Picnic 10 times')
			status.info.quan -= 9
		}
	} catch (e) {
		logger.error(`Picnic ${e.toString()}`)
	}
}

export const picnic = async (): Promise<void> => {
	logger.log('---Picnic---')
	const status = await goat.events.picnic.eventInfos()

	await claimQuests(status)
	await havePicnic(status)
}
