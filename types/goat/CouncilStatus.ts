import { User } from '../goatGeneric'

export type CouncilStatus = {
	desk: {
		master: User & { buff: number }
		desks: User & { buff: number }[]
		log: {
			uid1: number
			name1: string
			type: number
			time: number
		}[]
	}
}
