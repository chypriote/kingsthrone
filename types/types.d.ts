export type Ranking = {
	id?: number
	date: string
	rank: number
	power: number
	level: number
	player: Player
}

export type Player = {
	id?: number
	gid: number
	name: string
	vip: number

	military: number
	fortune: number
	provisions: number
	inspiration: number

	heroes: number
	maidens: number
	children: number
	intimacy: number

	rankings?: Ranking[]
	alliance_members?: AllianceMembers[]

	alliance?: Alliance
	rank?: Ranking
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
}
