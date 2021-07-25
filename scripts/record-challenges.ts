/* eslint-disable @typescript-eslint/no-unused-vars */
import { fromUnixTime } from 'date-fns'
import { ClubEventRwd, goat } from 'kingsthrone-api'
import { AllianceExperienceStatus, AllianceIntimacyStatus } from 'kingsthrone-api/lib/types/Challenges'
import { client } from './services/database'
import { Item } from 'kingsthrone-api/types/Item'

const rwdIdToRank = (index: number): number => {
	switch (true) {
	case index === 0: return 1
	case index === 1: return 2
	case index === 2: return 3
	case index === 4: return 4
	case index === 5: return 6
	case index === 6: return 11
	case index === 7: return 21
	default: return 0
	}
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
const logAllianceRewards = async (cid: number, rewards: ClubEventRwd[]): Promise<void> => {
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
	}
	i++
}

const logProgresses = async (cid: number, rewards: Item[]): Promise<void> => {
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
	const challenge: AllianceIntimacyStatus = await goat.challenges.allianceIntimacy.eventInfos()

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
	const challenge: AllianceExperienceStatus = await goat.challenges.allianceExperience.eventInfos()

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

const logChallenges = async () => {
	await logAllianceIntimacy()
	await logAllianceExperience()
}
logChallenges().then(() => { process.exit()})
