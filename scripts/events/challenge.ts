// noinspection DuplicatedCode

import { goat } from 'kingsthrone-api'
import { CHALLENGE_TYPES } from 'kingsthrone-api/lib/types/Challenges'
import { logger } from '../services/logger'

export const getChallengeRewards = async (type: CHALLENGE_TYPES): Promise<void> => {
	switch (type) {
	case CHALLENGE_TYPES.ALLIANCE_INTIMACY: return allianceIntimacy()
	case CHALLENGE_TYPES.ALLIANCE_EXPERIENCE: return allianceExperience()
	case CHALLENGE_TYPES.GRAIN: return grain()
	case CHALLENGE_TYPES.MAIDEN_EXPERIENCE: return maidenExp()
	case CHALLENGE_TYPES.RAISE_CHILDREN: return raiseChildren()
	case CHALLENGE_TYPES.TOURNEY: return tourney()
	case CHALLENGE_TYPES.CHARM: return charm()
	case CHALLENGE_TYPES.SPEND_GOLD: return spendGold()
	case CHALLENGE_TYPES.QUALITY: return quality()
	case CHALLENGE_TYPES.EQUIPMENT: return equipment()
	case CHALLENGE_TYPES.INTIMACY: return intimacy()
	case CHALLENGE_TYPES.RARE_BEASTS: return rareBeasts()
	case CHALLENGE_TYPES.XS_INTIMACY: return xsIntimacy()
	default: return
	}
}

const allianceIntimacy = async (): Promise<void> => {
	const event = await goat.challenges.allianceIntimacy.eventInfos()
	const score = event.myclubRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.clublove.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.allianceIntimacy.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge alliance intimacy`)
	}
}
const allianceExperience = async (): Promise<void> => {
	const event = await goat.challenges.allianceExperience.eventInfos()
	const score = event.myclubRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.club.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.allianceExperience.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge alliance experience`)
	}
}
const grain = async (): Promise<void> => {
	const event = await goat.challenges.grain.eventInfos()
	const score = event.myLiangShiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.liangshi.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.grain.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge grain`)
	}
}
const maidenExp = async (): Promise<void> => {
	const event = await goat.challenges.maidenExp.eventInfos()
	const score = event.myJiaRenRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.jiaren.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.maidenExp.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge maiden experience`)
	}
}
const raiseChildren = async (): Promise<void> => {
	const event = await goat.challenges.raiseChildren.eventInfos()
	const score = event.myzsShiliRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.zsshili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.raiseChildren.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge raise children`)
	}
}
const tourney = async (): Promise<void> => {
	const event = await goat.challenges.tourney.eventInfos()
	const score = event.myyamenRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.yamen.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.tourney.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge tourney`)
	}
}
const charm = async (): Promise<void> => {
	const event = await goat.challenges.charm.eventInfos()
	const score = event.myMeiLiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.meili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.charm.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge charm`)
	}
}
const spendGold = async (): Promise<void> => {
	const event = await goat.challenges.spendGold.eventInfos()
	const score = event.myYinLiangRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.yinliang.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.spendGold.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge spend gold`)
	}
}
const quality = async (): Promise<void> => {
	const event = await goat.challenges.quality.eventInfos()
	const score = event.myZiZhiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.zizhi.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.quality.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge quality`)
	}
}
const equipment = async (): Promise<void> => {
	const event = await goat.challenges.equipment.eventInfos()
	const score = event.myPowerRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.power.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.equipment.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge equipment`)
	}
}
const intimacy = async (): Promise<void> => {
	const event = await goat.challenges.intimacy.eventInfos()
	const score = event.myloveRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.love.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.intimacy.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge intimacy`)
	}
}
const rareBeasts = async (): Promise<void> => {
	const event = await goat.challenges.rareBeasts.eventInfos()
	const score = event.myZhenShouRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.zhenshou.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.rareBeasts.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge rare beasts`)
	}
}
const xsIntimacy = async (): Promise<void> => {
	const event = await goat.challenges.xsIntimacy.eventInfos()
	const ranks = await goat.challenges.xsIntimacy.getRankings()
	const score = ranks.mykualoveRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.kualove.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.xsIntimacy.claimProgressReward(task.id)
		logger.success(`Claimed reward ${task.id} for challenge rare beasts`)
	}
}
