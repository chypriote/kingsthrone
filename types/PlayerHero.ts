import { Player } from './Player'
import { Hero } from './Hero'

export type PlayerHero = {
	id?: number
	quality: number
	player: Player
	hero: Hero
}
