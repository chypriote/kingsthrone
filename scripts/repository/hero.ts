import { client } from '../services/database'
import { Hero } from '../../types/game.goat'
import { Player, PlayerHeroes } from '../../types/strapi'

export const createOrUpdateHero = async (hero: Hero, player: Player): Promise<PlayerHeroes[]> => {
	return client('player_heroes as ph')
		.join('heroes', 'heroes.id', 'ph.hero')
		.where({ hero: hero.id, player: player.id })

}
