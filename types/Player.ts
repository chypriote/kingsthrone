import { KingdomRanking } from './KingdomRanking'
import { AllianceMember } from './AllianceMember'
import { PlayerHero } from './PlayerHero'
import { Alliance } from './Alliance'
import { Hero } from './Hero'

export type Player = {
	id?: number
	gid: number
	name: string
	vip: number
	level: number
	power: number
	battle: number
	previous: number

	military: number
	fortune: number
	provisions: number
	inspiration: number

	heroes: number
	maidens: number
	children: number
	intimacy: number

	notes: string
	favorite: boolean
	inactive: boolean|null

	rankings?: KingdomRanking[]
	alliance_members?: AllianceMember[]
	player_heroes?: PlayerHero[]

	alliance?: Alliance
	rank?: KingdomRanking
	roster?: Hero[]

	updated_at: string
}
