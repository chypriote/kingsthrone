// noinspection DuplicatedCode

import { goat } from 'kingsthrone-api'
import { CHALLENGE_TYPES } from 'kingsthrone-api/lib/types/Challenges'
import { logger } from '../services/logger'

export const getChallengeRewards = async (type: CHALLENGE_TYPES): Promise<void> => {
	switch (type) {
	case CHALLENGE_TYPES.ALLIANCE_INTIMACY: return allianceIntimacy()
	case CHALLENGE_TYPES.ALLIANCE_EXPERIENCE: return allianceExperience()
	case CHALLENGE_TYPES.ALLIANCE_TOURNEY: return allianceTourney()
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
	case CHALLENGE_TYPES.XS_KINGDOM_POWER: return xsKingdomPower()
	case CHALLENGE_TYPES.XS_QUALITY: return xsQuality()
	case CHALLENGE_TYPES.ALLIANCE_POWER: return alliancePower()
	case CHALLENGE_TYPES.FEAST_POINTS: return feastPoints()
	case CHALLENGE_TYPES.KINGDOM_POWER: return kingdomPower()
	case CHALLENGE_TYPES.LOSE_SOLDIERS: return loseSoldiers()
	default: return
	}
}

const allianceIntimacy = async (): Promise<void> => {
	const event = await goat.challenges.allianceIntimacy()
	const score = event.myclubLoveRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.clublove.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.ALLIANCE_INTIMACY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge alliance intimacy`)
	}
}
const allianceExperience = async (): Promise<void> => {
	const event = await goat.challenges.allianceExperience()
	const score = event.myclubRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.club.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.ALLIANCE_EXPERIENCE, task.id)
		logger.success(`Claimed reward ${task.id} for challenge alliance experience`)
	}
}
const alliancePower = async (): Promise<void> => {
	const event = await goat.challenges.alliancePower()
	const score = event.myclubShiliRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.clubshili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.ALLIANCE_POWER, task.id)
		logger.success(`Claimed reward ${task.id} for challenge alliance power`)
	}
}
const allianceTourney = async (): Promise<void> => {
	const event = await goat.challenges.allianceTourney()
	const score = event.myclubyamen.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.clubyamen.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.ALLIANCE_TOURNEY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge alliance tourney`)
	}
}
const grain = async (): Promise<void> => {
	const event = await goat.challenges.grain()
	const score = event.myLiangShiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.liangshi.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.GRAIN, task.id)
		logger.success(`Claimed reward ${task.id} for challenge grain`)
	}
}
const maidenExp = async (): Promise<void> => {
	const event = await goat.challenges.maidenExperience()
	const score = event.myJiaRenRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.jiaren.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.MAIDEN_EXPERIENCE, task.id)
		logger.success(`Claimed reward ${task.id} for challenge maiden experience`)
	}
}
const raiseChildren = async (): Promise<void> => {
	const event = await goat.challenges.raiseChildren()
	const score = event.myzsShiliRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.zsshili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.RAISE_CHILDREN, task.id)
		logger.success(`Claimed reward ${task.id} for challenge raise children`)
	}
}
const tourney = async (): Promise<void> => {
	const event = await goat.challenges.tourney()
	const score = event.myyamenRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.yamen.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.TOURNEY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge tourney`)
	}
}
const charm = async (): Promise<void> => {
	const event = await goat.challenges.charm()
	const score = event.myMeiLiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.meili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.CHARM, task.id)
		logger.success(`Claimed reward ${task.id} for challenge charm`)
	}
}
const spendGold = async (): Promise<void> => {
	const event = await goat.challenges.spendGold()
	const score = event.myYinLiangRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.yinliang.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.SPEND_GOLD, task.id)
		logger.success(`Claimed reward ${task.id} for challenge spend gold`)
	}
}
const quality = async (): Promise<void> => {
	const event = await goat.challenges.quality()
	const score = event.myZiZhiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.zizhi.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.QUALITY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge quality`)
	}
}
const equipment = async (): Promise<void> => {
	const event = await goat.challenges.equipment()
	const score = event.myPowerRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.power.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.EQUIPMENT, task.id)
		logger.success(`Claimed reward ${task.id} for challenge equipment`)
	}
}
const intimacy = async (): Promise<void> => {
	const event = await goat.challenges.intimacy()
	const score = event.myloveRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.love.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.INTIMACY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge intimacy`)
	}
}
const rareBeasts = async (): Promise<void> => {
	const event = await goat.challenges.rareBeasts()
	const score = event.myZhenShouRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.zhenshou.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.RARE_BEASTS, task.id)
		logger.success(`Claimed reward ${task.id} for challenge rare beasts`)
	}
}
const feastPoints = async (): Promise<void> => {
	const event = await goat.challenges.feastPoints()
	const score = event.myJiuLouRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.jiulou.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.FEAST_POINTS, task.id)
		logger.success(`Claimed reward ${task.id} for challenge feast points`)
	}
}
const kingdomPower = async (): Promise<void> => {
	const event = await goat.challenges.kingdomPower()
	const score = event.myshiliRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.shili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.KINGDOM_POWER, task.id)
		logger.success(`Claimed reward ${task.id} for challenge kingdom power`)
	}
}
const loseSoldiers = async (): Promise<void> => {
	const event = await goat.challenges.loseSoldiers()
	const score = event.myShiBingRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.shibing.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.challenges.claimProgressReward(CHALLENGE_TYPES.LOSE_SOLDIERS, task.id)
		logger.success(`Claimed reward ${task.id} for challenge lose soldiers`)
	}
}

const xsIntimacy = async (): Promise<void> => {
	const event = await goat.xsChallenges.intimacy()
	const ranks = await goat.xsChallenges.getIntimacyRankings()
	const score = ranks.mykualoveRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.kualove.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.xsChallenges.claimProgressReward(CHALLENGE_TYPES.XS_INTIMACY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge XS Intimacy`)
	}
}
const xsKingdomPower = async (): Promise<void> => {
	const event = await goat.xsChallenges.kingdomPower()
	const ranks = await goat.xsChallenges.getKingdomPowerRankings()
	const score = ranks.mykuashiliRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.kuashili.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.xsChallenges.claimProgressReward(CHALLENGE_TYPES.XS_KINGDOM_POWER, task.id)
		logger.success(`Claimed reward ${task.id} for challenge XS Kingdom Power`)
	}
}
const xsQuality = async (): Promise<void> => {
	const event = await goat.xsChallenges.quality()
	const ranks = await goat.xsChallenges.getQuality()
	const score = ranks.mykuazizhiRid.score
	const claimed = JSON.parse(event.rewards[0].taskStatus.toString()).map((r: {id: number}) => r.id)

	for (const task of event.kuazizhi.cfg.task || []) {
		if (task.target > score || claimed.includes(task.id)) { continue }
		await goat.xsChallenges.claimProgressReward(CHALLENGE_TYPES.XS_QUALITY, task.id)
		logger.success(`Claimed reward ${task.id} for challenge XS Quality`)
	}
}
