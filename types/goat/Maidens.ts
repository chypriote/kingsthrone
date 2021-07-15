export const MAIDENS = [
	{ mid: 1, name: 'Marian', visits: 0 },
	{ mid: 2, name: 'Julia', visits: 0 },
	{ mid: 3, name: 'Isabella', visits: 0 },
	{ mid: 4, name: 'Katerina', visits: 0 },
	{ mid: 5, name: 'Margarate', visits: 0 },
	{ mid: 6, name: 'Mavia', visits: 0 },
	{ mid: 7, name: 'Gwyneth', visits: 0 },
	{ mid: 8, name: 'Constance', visits: 0 },
	{ mid: 9, name: 'Anastasia', visits: 0 },
	{ mid: 10, name: 'Joanna', visits: 0 },
	{ mid: 11, name: 'Amala', visits: 0 },
	{ mid: 12, name: 'Hildegard', visits: 0 },
	{ mid: 13, name: 'Christine', visits: 0 },
	{ mid: 14, name: 'Eleanor', visits: 0 },
	{ mid: 15, name: 'Yolanda', visits: 0 },
	{ mid: 16, name: 'Carmilla', visits: 0 },
	{ mid: 17, name: 'Vivienne', visits: 0 },
	{ mid: 18, name: 'Titania', visits: 0 },
	{ mid: 19, name: 'Theodora', visits: 0 },
	{ mid: 20, name: 'Lady Godiva', visits: 0 },
	{ mid: 30, name: 'Helen', visits: 0 },
	{ mid: 35, name: 'Morrigan', visits: 0 },
	{ mid: 36, name: 'Mulan', visits: 0 },
	{ mid: 37, name: 'Ginchiyo', visits: 0 },
	{ mid: 204, name: 'Adira', visits: 0 },
]

export type VisitsStatus = {
	num: number //available
	next: number
	label: string
}

export type StaminaResult = {
	items: {
		count: number
		id: number
	}
	status: VisitsStatus
}
