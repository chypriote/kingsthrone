import { EventQuest, EventQuestCfg, EventShop, EventShopItem } from './Event'
import { Item } from '../Item'

interface DarkCastleRun {
	yao: number
	sid: number
	cons: number
	quan: number //laps
	num: number
	gzzid: number
}

interface DarkCastleShop extends EventShop {
	wsItemShop: EventShopItem[]
}

interface DarkCastleChest {
	id: number
	need: number //laps needed
	items: Item[]
	isGet: number //2=yes
}

enum GRID_ITEM {
	NORMAL = 0,
	BLUE_BAG = 1,
	ORANGE_BAG = 2,
	PURPLE_BAG = 3,
}

interface DarkCastleGridSlot {
	id: number
	items: Item[]
	type: GRID_ITEM
	sid: number //1=portal
	isGet: boolean
}

interface DarkCastleGrid {
	gzzid: number
	min: number //??
	max: number //number of tiles ?
	list: DarkCastleGridSlot[]
}

interface DarkCastleInfo {
	info: {
		id: number
		title: string
		pindex: number
		type: number
		sTime: number //start time
		eTime: number //end time
		showTime: number
		_act_id: string
	}
	msg: string
	gezi: DarkCastleGrid
	rwd: DarkCastleChest[]
	image: Item[]
	wsScore: number //my score
	cd: { label: string, next: number }
}

export interface DarkCastle {
	wsInfo: DarkCastleInfo
	run: DarkCastleRun
	wsShop: DarkCastleShop
	wsTask: {
		taskscfg: EventQuestCfg[]
		tasks: EventQuest[]
	}
}
