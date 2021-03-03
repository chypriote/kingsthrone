import { Player } from './Player'

export type KingdomRanking = {
	id?: number
	date: string
	rank: number
	power: number
	level: number
	player: Player
}
