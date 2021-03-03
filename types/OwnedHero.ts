import { Hero } from './Hero'

export type OwnedHero = {
	id?: number
	level: number
	hero?: Hero|number

	quality: number

	military: number
	fortune: number
	provisions: number
	inspiration: number

	xp_quality: number
	xp_tourney: number

	ferocity: number
	brutality: number
	senior: number
}
