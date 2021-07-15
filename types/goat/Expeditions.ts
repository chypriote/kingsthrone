export type MerchantInfos = {
	beishu: number
	gid: number
	rwd: {
		count: number
		id: number
		kind: number
	}[]
	status: number
}


export type Expedition = {
	army: number
	id: number
	rwd: {
		count: number
		id: number
		kind: number
	}[]
}
export type ExpeditionInfo = {
	gid: number //current status
	heishu: number
	data: Expedition[]
}

export type KingdomExpInfo = {
	cfg: { bigId: number, playNum: number, smallId: number }
	playNum: number
	maxLevel: number
	chapterPhases: { chapter: number, num: number }[]
	chapterPhasesRwd: { id: number, status: number }[]
	firstAllRwd: { level: number, num: number }[]
	firstRwd: { level: number, num: number }[]
	levelPlayStar: { level: number, num: number }[]
}
