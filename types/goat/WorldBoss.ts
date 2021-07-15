interface Ge2dan {
	cd: { next: number, label: string }
	state: number
	allhp: number
	damage: number
}

interface Ge2danMyDmg {
	g2dmydamage: number
	g2dmyrank: number
	g2dallman: number
}

interface Shop {
	score: number
	buys: any[]
}

export interface WorldBoss {
	menggu: {
		state: number
		cd: { next: number, label: string }
		bo: number
		damage: number
	}
	mgft: {
		id: number //hero id
		h: number //available
		f: number //???
	}[]
	ge2dan: Ge2dan
	g2dft: any[]
	hurtRank: any[]
	ge2danMyDmg: Ge2danMyDmg
	shop: Shop
}
