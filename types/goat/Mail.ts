import { Item } from './Item'

export interface Mail {
	fts: number
	gts: number
	id: number
	items: Item[]
	mcontent: string
	mtitle: string
	mtype: number
	rts: number
	url: string
	urlName: string
}
