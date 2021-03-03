import { Player } from './Player'

export type TourneyRanking = {
	id?: number
	date: string
	rank: number
	points: number
	ratio: number
	player: Player
}
