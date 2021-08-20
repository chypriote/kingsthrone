import { find, orderBy } from 'lodash'
import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'
import { AllianceSiegeBattle, BATTLE_STATUS } from 'kingsthrone-api/lib/types/Events'

const wall = async (status: AllianceSiegeBattle): Promise<void> => {
	const attacks = status.info.freeNum + status.info.buyNum

	for (let i = 0; i < attacks; i++) {
		await goat.events.allianceSiege.attackWall()
		logger.log('Attacking enemy wall')
	}
}
const general = async (status: AllianceSiegeBattle): Promise<void> => {
	const attacks = status.info.freeNum + status.info.buyNum

	for (let i = 0; i < attacks; i++) {
		await goat.events.allianceSiege.attackGeneral()
		logger.log('Attacking enemy general')
	}
}
const plunder = async (status: AllianceSiegeBattle): Promise<void> => {
	const attacks = status.info.freeNum + status.info.buyNum

	const members = orderBy(status.data.members, 'shili', 'asc')

	for (let i = 0; i < attacks; i++) {
		await goat.events.allianceSiege.attackMember(members[0].id.toString())
		logger.log(`Plundering ${members[0].name}`)
	}
}

const getRewards = async (status: AllianceSiegeBattle): Promise<void> => {
	for (const task of status.tasks) {
		const todo = find(status.cfg.taskscfg, cfg => cfg.type == task.id)
		if (!todo) { continue }
		const goal = find(todo.dcCfg, g => g.id === task.rwd)
		if (!goal || goal.max > task.num) { continue }

		await goat.events.allianceSiege.claimTaskReward(task.id)
		console.log(`Claiming reward for task ${task.id}`)
	}
}

export const allianceSiege = async (): Promise<void> => {
	try {
		logger.log('---Alliance Siege---')
		const status = await goat.events.allianceSiege.eventInfos()

		if ([BATTLE_STATUS.FINISHED, BATTLE_STATUS.AWAITING].includes(status.data.type)) { return }

		switch (status.data.type) {
		case BATTLE_STATUS.WALL: await wall(status); break
		case BATTLE_STATUS.GENERAL: await general(status); break
		case BATTLE_STATUS.PLUNDER: await plunder(status); break
		}

		await getRewards(status)
	} catch (e) {
		logger.error(`[SIEGE] ${e.toString()}`)
	}
}
