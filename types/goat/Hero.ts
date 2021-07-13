import { GameStats } from '../game'

export enum TSkills {
	FEROCITY = 1,
	BRUTALITY = 2
}

export interface QualitySkill {
	id: number
	level: number
	zz: number
	slv: number //total
}
export interface TourneySkill {
	id: TSkills
	level: number
}

export interface Hero {
	id: number
	level: number
	class_level: number
	senior: number //Evol from items ?
	exp: number
	zzexp: number //Quality XP
	pkexp: number //Tourney XP
	epskill: QualitySkill[]
	pkskill: TourneySkill[] //Tourney
	ghskill: []
	banish: number
	mount: number //Beast
	hep: GameStats //Stats from tomes
	zz: GameStats //Quality skills value
	zep: GameStats //Stats from quality
	wep: GameStats //Stats from wives
	gep: GameStats //Paragon ?
	eep: GameStats //Paragon ?
	cep: GameStats //Paragon ?
	aep: GameStats //Total Stats
	zfight_num: number
	gfight_num: number
}
