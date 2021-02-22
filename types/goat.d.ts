export type Profile = {
	id: string
	name: string
	level: number
	sex: number
	job: number
	exp: number
	vip: number
	bmap: number
	mmap: number
	smap: number
	ep: {
		e1: number //Military
		e2: number //Gold
		e3: number //Provision
		e4: number //Inspiration
	}
	shili: number //kingdomPower
	love: number //Intimacy
	clubid: number
	clubname: string
	chenghao: number
	xuanyan: string
	chlist: [
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
