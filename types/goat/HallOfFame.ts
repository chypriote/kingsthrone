import { User } from '../goatGeneric'


export interface HallOfFamer extends User {
	id: 3,
	exp: number
	bmap: number
	mmap: number
	smap: number
	ep: {
		e1: number
		e2: number
		e3: number
		e4: number
	},
	love: number
	xuanyan: string
	chlist: {id: number}[]
	son_num: number
	wife_num: number
	hero_num: number
}
