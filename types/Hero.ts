import { Player } from './Player'
import { PlayerHero } from './PlayerHero'

export type Hero = {
	id?: number
	name: string
	quality: number
	base: number
	stars: number
	focus: string

	players: Player
	player_heroes: PlayerHero
}
