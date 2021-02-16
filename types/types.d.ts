export type Ranking = {
	id: number
	date: string
	power: number
	level: number
	player: Player
}

export type Player = {
	id: number
	gid: number
	name: string
	vip: number

	rankings?: Ranking[]
	alliance_members?: AllianceMembers[]

	alliance?: Alliance
	rank?: Ranking
}

export type Alliance = {
	id: number
	aid: number
	name: string
	members: AllianceMembers[]
}

export type AllianceMembers = {
	id: number
	player: Player
	alliance: Alliance
	active: boolean
	leftAt: string
}
