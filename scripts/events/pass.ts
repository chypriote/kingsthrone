import { EventPass, goat } from 'kingsthrone-api'
import { find } from 'lodash'
import { logger } from '../services/logger'

export enum PASS_TYPE {
	KINGS_PASS= 1086,
	VENETIAN_PASS= 1241,
}

export interface PassEndpoint {
	eventInfos(): Promise<EventPass>
	claimLevel(id: number): Promise<void>
	claimAllLevels(): Promise<void>
}
const getEndpoint = (type: PASS_TYPE): PassEndpoint|null => {
	switch (type) {
	case PASS_TYPE.VENETIAN_PASS: return goat.events.venetianPass
	case PASS_TYPE.KINGS_PASS: return goat.events.kingsPass
	default: return null
	}
}
const getPassName = (type: PASS_TYPE): string|null => {
	switch (type) {
	case PASS_TYPE.VENETIAN_PASS: return 'Venetian Pass'
	case PASS_TYPE.KINGS_PASS: return 'King\'s Pass'
	default: return null
	}
}

export const handlePass = async (type: PASS_TYPE): Promise<void> => {
	const endpoint = getEndpoint(type)
	if (!endpoint) { throw new Error(`No endpoint found for pass of type ${type}`) }

	logger.log(`---${getPassName(type)}---`)

	const event = await endpoint.eventInfos()
	const level = event.pass.level
	const rwd = find(event.pass.rwds, r => r.id === level)

	if (!rwd || rwd.rwd === 1) { return }
	await endpoint.claimAllLevels()
	logger.success('Claimed all levels')
}
