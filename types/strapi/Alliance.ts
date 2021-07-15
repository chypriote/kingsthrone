import { AllianceMember } from './AllianceMember'

export type Alliance = {
	id?: number
	aid: string
	name: string
	power?: number
	level?: number
	reputation?: number
	members?: AllianceMember[]
	server: number
	cross: boolean
}
