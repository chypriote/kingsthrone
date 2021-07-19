import { formatISO } from 'date-fns'
import { reduce } from 'lodash'
import { client } from '../services/database'
import { logger } from '../services/logger'
import { getHeroByHID } from '../repository/hero'
import { AccountHero } from '~/types/strapi/AccountHero'
import { Hero, QualitySkill, TSkills } from 'kingsthrone-api/lib/types/Hero'

export const getMyHeroByHID = async (hid: number): Promise<AccountHero|null> => {
	const heroes = await client('account_heroes')
		.select('account_heroes.*')
		.join('heroes', 'heroes.id', 'account_heroes.hero')
		.where('heroes.hid', '=', hid)
		.limit(1)

	return heroes.length ? heroes[0] : null
}

export const createMyHero = async (hero: AccountHero): Promise<void> => {
	await client('account_heroes')
		.insert({
			...hero,
			created_by: 1,
			updated_by: 1,
			created_at: formatISO(new Date()),
			updated_at: formatISO(new Date()),
		})
	logger.debug(`Hero ${hero.hero} created`)
}
export const updateMyHero = async (hero: AccountHero): Promise<void> => {
	if (!hero.id) {
		throw new Error(`Cant update non existing hero ${JSON.stringify(hero)}`)
	}

	await client('account_heroes')
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
	logger.debug(`Hero ${hero.id} updated`)
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

	const myHero: AccountHero = {
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
		military_quality: existing?.military_quality || 0,
	}

	existing?.id ? await updateMyHero({ ...myHero, id: existing.id }) : await createMyHero(myHero)
}
