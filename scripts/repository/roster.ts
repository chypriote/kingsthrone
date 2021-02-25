import { formatISO } from 'date-fns'
import { reduce } from 'lodash'
import { OwnedHero } from '~/types/strapi'
import { Hero, QualitySkill, TSkills } from '~/types/goat/hero'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { getHeroByHID } from '../repository/hero'

export const getMyHeroByHID = async (hid: number): Promise<OwnedHero|null> => {
	const heroes = await client('owned_heroes')
		.where({ hid })
		.limit(1)

	return heroes.length ? heroes[0] : null
}

export const createMyHero = async (hero: OwnedHero): Promise<void> => {
	return client('owned_heroes')
		.insert({
			...hero,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
}
export const updateMyHero = async (hero: OwnedHero): Promise<void> => {
	if (!hero.id) {
		throw new Error(`Cant update non existing hero ${JSON.stringify(hero)}`)
	}

	return client('owned_heroes')
		.where({ id: hero.id })
		.update({
			level: hero.level,
			quality: hero.quality,
			military: hero.military,
			fortune: hero.fortune,
			provisions: hero.provisions,
			inspiration: hero.inspiration,
			xp_quality: hero.xp_quality,
			xp_tourney: hero.xp_tourney,
			ferocity: hero.ferocity,
			brutality: hero.brutality,
			senior: hero.senior,
			updated_at: formatISO(new Date()),
		})
}


export const createOrUpdateMyHero = async (goatHero: Hero): Promise<void> => {
	const hero = await getHeroByHID(goatHero.id)
	if (!hero) {
		return logger.error(`Could not find goat hero with id: ${goatHero.id}`)
	}

	const existing = await getMyHeroByHID(goatHero.id)

	const stats = goatHero.aep
	const brutality = goatHero.pkskill.find(it => it.id === TSkills.BRUTALITY)?.level || 0
	const ferocity = goatHero.pkskill.find(it => it.id === TSkills.FEROCITY)?.level || 0
	const quality = reduce(goatHero.epskill, (q: number, skill: QualitySkill) => q + skill.zz, 0)

	const myHero: OwnedHero = {
		hid: goatHero.id,
		hero: hero.id,
		level: goatHero.level,
		quality: quality,
		military: stats.e1,
		fortune: stats.e2,
		provisions: stats.e3,
		inspiration: stats.e4,
		xp_quality: goatHero.zzexp,
		xp_tourney: goatHero.pkexp,
		ferocity: ferocity,
		brutality: brutality,
		senior: goatHero.senior,
	}

	existing?.id ? await updateMyHero({ ...myHero, id: existing.id }) : await createMyHero(myHero)
}
