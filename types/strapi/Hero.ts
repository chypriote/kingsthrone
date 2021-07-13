import { Player } from './Player'
import { PlayerHero } from './PlayerHero'
import { Maiden } from './Maiden'

export enum Attribute {
	MILITARY = 'military',
	FORTUNE = 'fortune',
	PROVISIONS = 'provisions',
	INSPIRATION = 'inspiration',
	BALANCED = 'balanced',
}

export type Hero = {
	id?: number
	hid: number
	name: string

	stars: number
	quality: number
	unlock: string

	focus: Attribute
	second_focus: Attribute

	players: Player
	player_heroes: PlayerHero
	maiden: Maiden
}
