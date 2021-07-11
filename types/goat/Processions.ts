export const NPCS = [
	{ nid: 3, name: 'Lonely Tom', visits: 0 },
	{ nid: 6, name: 'Robert', visits: 0 },
	{ nid: 15, name: 'Gretchen', visits: 0 },
	{ nid: 17, name: 'Emissary ad-Din', visits: 0 },
	{ nid: 24, name: 'Nikolai', visits: 0 },
	{ nid: 26, name: 'Vernan Twill', visits: 0 },
	{ nid: 28, name: 'Le Fanu', visits: 0 },
	{ nid: 31, name: 'George', visits: 0 },
	{ nid: 32, name: 'Geoffrey', visits: 0 },
	{ nid: 38, name: 'Melody', visits: 0 },
	{ nid: 41, name: 'Bill', visits: 0 },
	{ nid: 42, name: 'Nicholas', visits: 0 },
	{ nid: 49, name: 'Alexei', visits: 0 },
	{ nid: 101, name: 'Theodora', visits: 0 },
	{ nid: 102, name: 'Yolanda', visits: 0 },
	{ nid: 104, name: 'Marian', visits: 0 },
	{ nid: 105, name: 'Margarate', visits: 0 },
	{ nid: 106, name: 'Joanna', visits: 0 },
	{ nid: 107, name: 'Isabella', visits: 0 },
	{ nid: 108, name: 'Mavia', visits: 0 },
	{ nid: 109, name: 'Amala', visits: 0 },
	{ nid: 110, name: 'Anastasia', visits: 0 },
	{ nid: 111, name: 'Constance', visits: 0 },
	{ nid: 112, name: 'Carmilla', visits: 0 },
	{ nid: 114, name: 'Gwyneth', visits: 0 },
	{ nid: 115, name: 'Julia', visits: 0 },
	{ nid: 116, name: 'Titania', visits: 0 },
	{ nid: 117, name: 'Christine', visits: 0 },
	{ nid: 118, name: 'Katerina', visits: 0 },
	{ nid: 119, name: 'Vivienne', visits: 0 },
	{ nid: 120, name: 'Hildegard', visits: 0 },
	{ nid: 121, name: 'Eleanor', visits: 0 },
	{ nid: 124, name: 'Helen', visits: 0 },
	{ nid: 133, name: 'Mulan', visits: 0 },
	{ nid: 134, name: 'Ginchiyo', visits: 0 },
	{ nid: 136, name: 'Elizabeth', visits: 0 },
	{ nid: 138, name: 'Louise', visits: 0 },
]

export type LuckStatus = {
	auto2: number, //grain donation on
	auto3: number, //gold donation on
	ySet: number, //minimum luck
	num: number //current luck
}

export type ProcessionsStatus = {
	num: number //available
	next: number
	label: string
}

//2: gold
//3: grain
//4: soldiers
//type1= npc?
//type5= maiden ?
export enum PROCESSIONS {
	NPC= 1,
	MAIDEN= 5
}
//haogan 5
//haogan 0 ???
export type ProcessionGain = {
	haogan: number
	items: {count: number, id: number}[]
	npcid: number
	type: PROCESSIONS
}
export type ProcessionResult= {
	result: ProcessionGain
	status: ProcessionsStatus
	luck: LuckStatus
}

export type GoodwillResult = {
	items: {
		count: number
		id: number
	}
	status: ProcessionsStatus
}
