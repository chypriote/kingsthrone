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

export type Rank = {
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
	rid: number
	num: number
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
