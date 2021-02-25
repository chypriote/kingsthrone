import { GameStats } from './game'

declare enum HeroID {
	SIR_OLIVER = 1,
	GERARD = 2,
	MARCELLO = 3,
	MAGNUS = 4,
	CYRANO = 5,
	CONSTABLE_BERTRAND = 6,
	ALAIN_LE_ROUX = 7,
	TUCK = 8,
	SCARLETT = 9,
	GUILLAUME_DORANGE = 10,
	PATRICK = 11,
	DON_JUAN = 12,
	ROLLO = 13,
	ENRICO_DANDOLO = 14,
	JOHN_HAWKWOOD = 15,
	EL_CID = 16,
	DANTE = 17,
	ULRICH = 18,
	ROMEO = 19,
	JOHN_LITTLE = 20,
	COSIMO_DE_MEDICI = 21,
	FINNIAN = 22,
	SIR_BEVOIS = 23,
	PERCIVAL = 36,
	GALAHAD = 37,
	IVANHOE = 44,
	MERLIN = 52,
}
declare enum QSkills {
	MIL_ADVISEMENT_1 = 1,
	MIL_TACTICAL_ANALYSIS_2 = 2,
	MIL_COMMANDING_3 = 3,
	MIL_STRATEGIC_PLANNING_4 = 4,
	FOR_MERCANTILISM_1 = 6,
	FOR_BANKING_2 = 7,
	FOR_COFFER_3 = 8,
	FOR_TREASURY_4 = 9,
	PRO_BARONY_1 = 11,
	PRO_VISCOUNTCY_2 = 12,
	PRO_COUNTY_3 = 13,
	PRO_MARCH_4 = 14,
	INS_BANNERMAN_2 = 16,
	INS_CHAPLAIN_2 = 17,
	INS_OFFICER = 18,
	INS_HEROIC_1 = 19,
	MIL_MAN_AT_ARMS_4 = 21,
	FOR_BY_THE_BOOKS_5 = 22,
	PRO_HARDY_4 = 23,
	INS_PEOPLE_4 = 24,
	MIL_BEAT_COP_5 = 25,
	FOR_QUICK_WITTED_4 = 26,
	PRO_FRIARS_PAN_4 = 27,
	INS_MERRY_MAN_6 = 28,
	MIL_GIANT_BREAKER_5 = 29,
	MIL_SHILLELAGH_5 = 30,
	MIL_CRUELTY_5 = 31,
	PRO_HEARTY_5 = 32,
	FOR_PATRIARCH_5 = 33,
	INS_HAWKWOODS_MEN_5 = 34,
	MIL_OUTSTANDING_5 = 35,
	FOR_SUPREME_POETRY_5 = 36,
	PRO_OBLATES_CALLING_5 = 37,
	INS_YOUNG_LOVE_5 = 38,
	MIL_BIG_STICK_5 = 39,
	FOR_ELDERS_WISDOM_5 = 40,
	PRO_ASCETIC_IDEAL_5 = 41,
	INS_WORLD_WANDERER_5 = 42,
	MIL_HEROIC_BEARING_5 = 60,
	MIL_SIEGE_PERILOUS_5 = 61,
	MIL_KNIGHT_ROUND_3 = 62,
	FOR_ROB_FROM_RICH_5 = 72,
	PRO_GIVE_TO_POOR_5 = 73,
}
declare enum TSkills {
	FEROCITY = 1,
	BRUTALITY = 2
}

export interface QualitySkill {
	id: QSkills
	level: number
	zz: number
	slv: number //total
}
export interface TourneySkill {
	id: TSkills
	level: number
}

export interface Hero {
	id: number | HeroID
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
