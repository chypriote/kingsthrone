export type KingdomRanking = {
	id?: number
	date: string
	rank: number
	power: number
	level: number
	player: Player
}
export type TourneyRanking = {
	id?: number
	date: string
	rank: number
	points: number
	ratio: number
	player: Player
}

export type Player = {
	id?: number
	gid: number
	name: string
	vip: number
	level: number
	power: number

	military: number
	fortune: number
	provisions: number
	inspiration: number

	heroes: number
	maidens: number
	children: number
	intimacy: number

	rankings?: KingdomRanking[]
	alliance_members?: AllianceMembers[]
	player_heroes?: PlayerHeroes[]

	alliance?: Alliance
	rank?: KingdomRanking
	roster?: Hero[]
}

export type Hero = {
	id?: number
	name: string
	quality: number
	base: number
	stars: number
	focus: string

	players: Player
	player_heroes: PlayerHeroes
}

export type Alliance = {
	id?: number
	aid: number
	name: string
	power?: number
	level?: number
	reputation?: number
	members?: AllianceMembers[]
}

export type AllianceMembers = {
	id?: number
	player: Player
	alliance: Alliance
	active: boolean
	leftAt: string
	rank: number
}

export type PlayerHeroes = {
	id?: number
	player: Player
	hero: Hero
	quality: number
}

export type OwnedHero = {
	id?: number
	level: number
	hero?: Hero|number

	quality: number

	military: number
	fortune: number
	provisions: number
	inspiration: number

	xp_quality: number
	xp_tourney: number

	ferocity: number
	brutality: number
	senior: number
}
