import { Player } from './Player'
import { Hero } from './Hero'

export type PlayerHero = {
	id?: number
	quality: number
	player: Player|number
	hero: Hero|number
	hid: number
}
