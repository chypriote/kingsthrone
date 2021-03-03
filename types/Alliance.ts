import { AllianceMember } from './AllianceMember'

export type Alliance = {
	id?: number
	aid: number
	name: string
	power?: number
	level?: number
	reputation?: number
	members?: AllianceMember[]
}
