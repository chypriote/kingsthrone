import { client } from '../services/database'
import { Hero } from '~/types/Hero'
import { Player } from '~/types/Player'
import { PlayerHero } from '~/types/PlayerHero'

export const createOrUpdateHero = async (hero: Hero, player: Player): Promise<PlayerHero[]> => {
	return client('player_heroes as ph')
		.join('heroes', 'heroes.id', 'ph.hero')
		.where({ hero: hero.id, player: player.id })
}

export const getHeroByHID = async (hid: number): Promise<Hero|null> => {
	const heroes = await client('heroes')
		.where({ hid })
		.limit(1)

	return heroes.length ? heroes[0] : null
}
