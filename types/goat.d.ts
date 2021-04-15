export type Profile = {
	id: string
	name: string
	level: number
	sex: number
	job: number
	exp: number
	vip: number
	//Display: Drusilla Chap 97 (5), Afk 39 (5), Jin 105 (2)
	bmap: number //campaign chapter// drusila 97 afk 39  jin 105
	mmap: number //chapter completed // drusila 486 afk 195 jin 523
	smap: number //battle in mission drusila 3880  afk 1557  jin 4176
	// Current chapter: bmap
	// Current mission: mmap - 5 * bmap : Drusila 1 afk 0 jin -2
	// chap72map1=(mmap 356, smap 2840, bmap 72)
	ep: {
		e1: number //Military
		e2: number //Gold
		e3: number //Provision
		e4: number //Inspiration
	}
	shili: string //kingdomPower
	love: number //Intimacy
	clubid: number
	clubname: string
	chenghao: number //title
	xuanyan: string
	chlist: [ //titles list
		{
			id: number
		}
	]
	son_num: number //Children
	wife_num: number //Maidens
	hero_num: number //Heroes
	headType: number
	headId: number
	vipStatus: number
	set: number
}

export type KingdomRank = {
	uid: string
	name: string
	job: number
	sex: number
	level: number
	vip: number
	chenghao: number
	headframe: number
	headType: number
	headId: number
	vipStatus: number
	shili: number //kp
	clubid: number
	clubname: string
	frame: number
	head: number
	chatframe: number
	rid: number //classement
	num: number //kp
}

export type TourneyRank = {
	uid: string
	name: string
	job: number
	sex: number
	level: number
	vip: number
	chenghao: number
	headframe: number
	headType: number
	headId: number
	vipStatus: number
	shili: number //kp
	clubid: number
	clubname: string
	frame: number
	head: number
	chatframe: number
	rid: number //classement
	num: number //points
}

export type Club = {
	id: string
	name: string
	level: string
	exp: string
	fund: string
	qq: string
	laoma: string
	outmsg: string
	rid: number
	allShiLi: number
	notice: string
	isJoin: string
	icon: string
	members: [
		{ name: string, post: number },
	],
	userShili: number
	userLevel: number
}

export type EventRank = {
	name: string
	rid: number
	score: number
	uid: string
}

type GarrisonInfo = {
	wife: {
		OneLunTime: number
		wifeId: number
		startTime: number
		Critical: number
		isCheck: number
		level: number
		maxNum: number
		intimacy: number
		charm: number
	}
	hero: {
		heroId: number
		startTime: number
		nextTime: number
		rewardsBySecond: { kind: number, count: number, id: number }[]
		isCheck: number
		level: number
		quality: number
		heroLevel: number
		attribute: number
	}
}
type EventInfo = {
	eventId: string,
	isCheck: number
	startTime: number
	son_slot: { slot: number, sonId: number }[]
	type: number
	SuccessRate: number
	rarity: number
	isDouble: number
	status: number
}
type TaskInfo = {
	refreshTime: number
	refreshNum: number
	event: EventInfo[]
}

export type CastleInfos = {
	id: number
	level: number
	exp: number
	isNext: number
	expStartTime: number
	GarrisonInfo: GarrisonInfo
	task: TaskInfo
}

export type XSPlayerRank = {
	uid: number
	name: string
	job: number
	sex: number
	level: number
	vip: number
	chenghao: number
	headframe: number
	headType: number
	headId: number
	vipStatus: number
	shili: number
	clubid: number
	clubname: string
	frame: number
	head: number
	chatframe: number
	rid: number
	num: number
}

export type XSPlayer = {
	id: number
	uid: number
	name: string
	level: number
	sex: number
	job: number
	exp: number
	vip: number
	bmap: number
	mmap: number
	smap: number
	ep: {e1: number, e2: number, e3: number, e4: number}
	shili: string
	love: number
	clubid: number
	clubname: string
	chenghao: number
	xuanyan: string
	chlist: []
	son_num: number
	wife_num: number
	hero_num: number
	headType: number
	headId: number
	vipStatus: number
}

export type XSAlliance = {
	rid: number //rank
	icon: string
	cname: string //name
	num: number //members
	mzName: string //leader
	allShiLi: number //power
	maxNum: number //max members
	cid: number //id
	worship: number //boost
	win: number
	sev: number //server
}

export type XSOpponent = {
	fcid: number,
	isWin: boolean,
	time: number,
	turn: number,
	type: number,
}

export type InLaw = {
	uid: string
	name: string
	job: number
	sex: number
	level: number
	vip: number
	chenghao: number
	headframe: number
	headType: number
	headId: number
	vipStatus: number
	shili: number
	clubid: number
	clubname: string
	frame: number
	head: number
	chatframe: number
	num: number //likeability
	num2: number //married
	num3: number //last connection
	tip: number
}

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
	npcid: 24
	type: PROCESSIONS
}

export type ProcessionResult= {
	result: ProcessionGain
	status: ProcessionsStatus
	luck: LuckStatus
}
