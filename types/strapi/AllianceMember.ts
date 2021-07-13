import { Alliance } from './Alliance'
import { Player } from './Player'

export type AllianceMember = {
	id?: number
	player: Player
	alliance: Alliance
	active: boolean
	leftAt: string
	rank: number
}
