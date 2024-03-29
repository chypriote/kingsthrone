/* eslint-disable @typescript-eslint/no-unused-vars */
import { fromUnixTime } from 'date-fns'
import { ClubEventRwd, goat } from 'kingsthrone-api'
import { Item } from 'kingsthrone-api/types/Item'
import { EventRwd } from 'kingsthrone-api/lib/types/Events'
import {
	AllianceExperienceStatus,
	AllianceIntimacyStatus,
	AlliancePowerStatus
} from 'kingsthrone-api/lib/types/Challenges'
import { client } from './services/database'

const rwdIdToRank = (index: number): number => {
	switch (true) {
	case index === 0: return 1
	case index === 1: return 2
	case index === 2: return 3
	case index === 3: return 4
	case index === 4: return 6
	case index === 5: return 11
	case index === 6: return 21
	case index === 7: return 51
	case index === 8: return 101
	default: return 0
	}
}
const challengeByIdAndDateExists = async ({ id, sTime }: { id: number, sTime: number }): Promise<boolean> => {
	const test = await client('challenges')
		.where({ cid: id, start: fromUnixTime(sTime) })
		.limit(1)

	return test.length > 0
}

const logRewards = async (cid: number, rewards: {id: number, count:number}[]): Promise<void> => {
	for (const item of rewards) {
		await client('challenge_reward_items').insert({
			count: item.count,
			item: item.id,
			challenge_reward: cid,
		})
	}
}
export const logAllianceRewards = async (cid: number, rewards: ClubEventRwd[]): Promise<void> => {
	let i = 0
	for (const reward of rewards) {
		//Logging leader rewards
		const [lid] = await client('challenge_rewards').insert({
			challenge: cid,
			rank: rwdIdToRank(i),
			leader: true,
		}).returning('id')
		await logRewards(lid, reward.mengzhu)
		//logging member rewards
		const [mid] = await client('challenge_rewards').insert({
			challenge: cid,
			rank: rwdIdToRank(i),
			leader: false,
		}).returning('id')
		await logRewards(mid, reward.member)
		i++
	}
}
export const logChallengeRewards = async (cid: number, rewards: EventRwd[]): Promise<void> => {
	let i = 0
	for (const reward of rewards) {
		const [rid] = await client('challenge_rewards').insert({
			challenge: cid,
			rank: rwdIdToRank(i),
			leader: false,
		}).returning('id')
		await logRewards(rid, reward.member)
		i++
	}
}

export const logProgresses = async (cid: number, rewards: Item[]): Promise<void> => {
	for (const item of rewards) {
		await client('challenge_progress_items').insert({
			count: item.count,
			item: item.id,
			challenge_progress: cid,
		})
	}
}
const logAllianceProgress = async (cid: number, tasks: { id: number, target: number, rewards: Item[] }[]): Promise<void> => {
	for (const task of tasks) {
		const [tid] = await client('challenge_progresses').insert({
			challenge: cid,
			score: task.target,
		}).returning('id')
		await logProgresses(tid, task.rewards)
	}
}

const logAllianceIntimacy = async () => {
	const challenge: AllianceIntimacyStatus = await goat.challenges.allianceIntimacy()
	if (await challengeByIdAndDateExists(challenge.clublove.cfg.info)) { return }

	const [id] = await client('challenges').insert({
		name: 'Alliance Intimacy',
		cid: challenge.clublove.cfg.info.id,
		type: challenge.clublove.cfg.info.type,
		start: fromUnixTime(challenge.clublove.cfg.info.sTime),
		end: fromUnixTime(challenge.clublove.cfg.info.eTime),
		alliance: true,
		title: 'King of Paramours',
	}).returning('id')

	await logAllianceRewards(id, challenge.clublove.cfg.rwd)
}
const logAllianceExperience = async () => {
	const challenge: AllianceExperienceStatus = await goat.challenges.allianceExperience()
	if (await challengeByIdAndDateExists(challenge.club.cfg.info)) { return }

	const [id] = await client('challenges').insert({
		name: 'Alliance Experience',
		cid: challenge.club.cfg.info.id,
		type: challenge.club.cfg.info.type,
		start: fromUnixTime(challenge.club.cfg.info.sTime),
		end: fromUnixTime(challenge.club.cfg.info.eTime),
		alliance: true,
		title: 'King of Enlightenment',
	}).returning('id')

	await logAllianceRewards(id, challenge.club.cfg.rwd)
	await logAllianceProgress(id, challenge.club.cfg.task)
}
const logAlliancePower = async () => {
	const challenge: AlliancePowerStatus = await goat.challenges.alliancePower()
	if (await challengeByIdAndDateExists(challenge.clubshili.cfg.info)) { return }

	const [id] = await client('challenges').insert({
		name: 'Alliance Power',
		cid: challenge.clubshili.cfg.info.id,
		type: challenge.clubshili.cfg.info.type,
		start: fromUnixTime(challenge.clubshili.cfg.info.sTime),
		end: fromUnixTime(challenge.clubshili.cfg.info.eTime),
		alliance: true,
		title: 'King of Warriors',
	}).returning('id')

	await logAllianceRewards(id, challenge.clubshili.cfg.rwd)
	await logAllianceProgress(id, challenge.clubshili.cfg.task)
}
const logGrain = async () => {
	const challenge = await goat.challenges.grain()
	if (await challengeByIdAndDateExists(challenge.liangshi.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Grain',
		cid: challenge.liangshi.cfg.info.id,
		type: challenge.liangshi.cfg.info.type,
		start: fromUnixTime(challenge.liangshi.cfg.info.sTime),
		end: fromUnixTime(challenge.liangshi.cfg.info.eTime),
		alliance: false,
		title: 'Lord of Prudence',
	}).returning('id')

	await logChallengeRewards(id, challenge.liangshi.cfg.rwd)
}
const logQuality = async () => {
	const challenge = await goat.challenges.quality()
	if (await challengeByIdAndDateExists(challenge.zizhi.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Quality',
		cid: challenge.zizhi.cfg.info.id,
		type: challenge.zizhi.cfg.info.type,
		start: fromUnixTime(challenge.zizhi.cfg.info.sTime),
		end: fromUnixTime(challenge.zizhi.cfg.info.eTime),
		alliance: false,
		title: 'King of Virtue',
	}).returning('id')

	await logChallengeRewards(id, challenge.zizhi.cfg.rwd)
}
const logMaidenExp = async () => {
	const challenge = await goat.challenges.maidenExperience()
	if (await challengeByIdAndDateExists(challenge.jiaren.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Maiden Experience',
		cid: challenge.jiaren.cfg.info.id,
		type: challenge.jiaren.cfg.info.type,
		start: fromUnixTime(challenge.jiaren.cfg.info.sTime),
		end: fromUnixTime(challenge.jiaren.cfg.info.eTime),
		alliance: false,
		title: 'King of Wisdom',
	}).returning('id')

	await logChallengeRewards(id, challenge.jiaren.cfg.rwd)
}
const logRaiseChildren = async () => {
	const challenge = await goat.challenges.raiseChildren()
	if (await challengeByIdAndDateExists(challenge.zsshili.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Raise Children',
		cid: challenge.zsshili.cfg.info.id,
		type: challenge.zsshili.cfg.info.type,
		start: fromUnixTime(challenge.zsshili.cfg.info.sTime),
		end: fromUnixTime(challenge.zsshili.cfg.info.eTime),
		alliance: false,
		title: 'King of Abundance',
	}).returning('id')

	await logChallengeRewards(id, challenge.zsshili.cfg.rwd)
}
const logTourney = async () => {
	const challenge = await goat.challenges.tourney()
	if (await challengeByIdAndDateExists(challenge.yamen.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Tourney',
		cid: challenge.yamen.cfg.info.id,
		type: challenge.yamen.cfg.info.type,
		start: fromUnixTime(challenge.yamen.cfg.info.sTime),
		end: fromUnixTime(challenge.yamen.cfg.info.eTime),
		alliance: false,
		title: 'King of Glory',
	}).returning('id')

	await logChallengeRewards(id, challenge.yamen.cfg.rwd)
}
const logCharm = async () => {
	const challenge = await goat.challenges.charm()
	if (await challengeByIdAndDateExists(challenge.meili.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Raise Children',
		cid: challenge.meili.cfg.info.id,
		type: challenge.meili.cfg.info.type,
		start: fromUnixTime(challenge.meili.cfg.info.sTime),
		end: fromUnixTime(challenge.meili.cfg.info.eTime),
		alliance: false,
		title: 'King of Grace',
	}).returning('id')

	await logChallengeRewards(id, challenge.meili.cfg.rwd)
}
const logSpendGold = async () => {
	const challenge = await goat.challenges.spendGold()
	if (await challengeByIdAndDateExists(challenge.yinliang.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Spend Gold',
		cid: challenge.yinliang.cfg.info.id,
		type: challenge.yinliang.cfg.info.type,
		start: fromUnixTime(challenge.yinliang.cfg.info.sTime),
		end: fromUnixTime(challenge.yinliang.cfg.info.eTime),
		alliance: false,
		title: 'King of Grace',
	}).returning('id')

	await logChallengeRewards(id, challenge.yinliang.cfg.rwd)
}
const logIntimacy = async () => {
	const challenge = await goat.challenges.intimacy()
	if (await challengeByIdAndDateExists(challenge.love.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Intimacy',
		cid: challenge.love.cfg.info.id,
		type: challenge.love.cfg.info.type,
		start: fromUnixTime(challenge.love.cfg.info.sTime),
		end: fromUnixTime(challenge.love.cfg.info.eTime),
		alliance: false,
		title: 'King of Passion',
	}).returning('id')

	await logChallengeRewards(id, challenge.love.cfg.rwd)
}
const logRareBeasts = async () => {
	const challenge = await goat.challenges.rareBeasts()
	if (await challengeByIdAndDateExists(challenge.zhenshou.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Rare Beasts',
		cid: challenge.zhenshou.cfg.info.id,
		type: challenge.zhenshou.cfg.info.type,
		start: fromUnixTime(challenge.zhenshou.cfg.info.sTime),
		end: fromUnixTime(challenge.zhenshou.cfg.info.eTime),
		alliance: false,
		title: 'King of Beasts',
	}).returning('id')

	await logChallengeRewards(id, challenge.zhenshou.cfg.rwd)
}
const logFeastPoints = async () => {
	const challenge = await goat.challenges.feastPoints()
	if (await challengeByIdAndDateExists(challenge.jiulou.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Feast Points',
		cid: challenge.jiulou.cfg.info.id,
		type: challenge.jiulou.cfg.info.type,
		start: fromUnixTime(challenge.jiulou.cfg.info.sTime),
		end: fromUnixTime(challenge.jiulou.cfg.info.eTime),
		alliance: false,
		title: 'King of Conquerors',
	}).returning('id')

	await logChallengeRewards(id, challenge.jiulou.cfg.rwd)
}
const logLoseSoldiers = async () => {
	const challenge = await goat.challenges.loseSoldiers()
	if (await challengeByIdAndDateExists(challenge.shibing.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Lose Soldiers',
		cid: challenge.shibing.cfg.info.id,
		type: challenge.shibing.cfg.info.type,
		start: fromUnixTime(challenge.shibing.cfg.info.sTime),
		end: fromUnixTime(challenge.shibing.cfg.info.eTime),
		alliance: false,
		title: 'Lord of Militance',
	}).returning('id')

	await logChallengeRewards(id, challenge.shibing.cfg.rwd)
}
const logKingdomPower = async () => {
	const challenge = await goat.challenges.kingdomPower()
	if (await challengeByIdAndDateExists(challenge.shili.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Kingdom Power',
		cid: challenge.shili.cfg.info.id,
		type: challenge.shili.cfg.info.type,
		start: fromUnixTime(challenge.shili.cfg.info.sTime),
		end: fromUnixTime(challenge.shili.cfg.info.eTime),
		alliance: false,
		title: 'King of Might',
	}).returning('id')

	await logChallengeRewards(id, challenge.shili.cfg.rwd)
}
const logXSKingdomPower = async () => {
	const challenge = await goat.xsChallenges.kingdomPower()
	if (await challengeByIdAndDateExists(challenge.kuashili.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Cross-Server Kingdom Power',
		cid: challenge.kuashili.cfg.info.id,
		type: challenge.kuashili.cfg.info.type,
		start: fromUnixTime(challenge.kuashili.cfg.info.sTime),
		end: fromUnixTime(challenge.kuashili.cfg.info.eTime),
		alliance: false,
		title: 'Emperor of Might',
	}).returning('id')
	await logChallengeRewards(id, challenge.kuashili.cfg.rwd)
}
const logXSQuality = async () => {
	const challenge = await goat.xsChallenges.quality()
	if (await challengeByIdAndDateExists(challenge.kuazizhi.cfg.info)) { return }
	const [id] = await client('challenges').insert({
		name: 'Cross-Server Quality',
		cid: challenge.kuazizhi.cfg.info.id,
		type: challenge.kuazizhi.cfg.info.type,
		start: fromUnixTime(challenge.kuazizhi.cfg.info.sTime),
		end: fromUnixTime(challenge.kuazizhi.cfg.info.eTime),
		alliance: false,
		title: '',
	}).returning('id')
	await logChallengeRewards(id, challenge.kuazizhi.cfg.rwd)
}


const logChallenges = async () => {
	await logGrain()
	await logXSQuality()
}

// logChallenges().then(() => {process.exit()})
