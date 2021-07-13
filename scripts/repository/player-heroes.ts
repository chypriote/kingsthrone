import { client } from '../services/database'
import { Hero } from '~/types/strapi/Hero'
import { Player } from '~/types/strapi/Player'
import { PlayerHero } from '~/types/strapi/PlayerHero'

export const updatePlayerHero = async (hid: number, gid: string, quality: number): Promise<void> => {
	const hero: Hero = (await client('heroes').where({ hid }).limit(1))[0]
	const player: Player = (await client('players').where({ gid }).limit(1))[0]

	if (!hero || !player) {
		throw new Error(`Invalid values: hero ${hid} player ${gid}`)
	}
	const existing = await client('player_heroes').where({ player: player.id, hero: hero.id }).limit(1)

	if (existing.length) {
		await client('player_heroes').update({ quality }).where({ player: player.id, hero: hero.id })
	} else {
		await client('player_heroes').insert({ quality, player: player.id, hero: hero.id })
	}
}

export const getRoster = async (gid: string): Promise<PlayerHero[]> => {
	return client('player_heroes as ph')
		.select('ph.*', 'heroes.hid')
		.join('players', 'players.id', 'ph.player')
		.join('heroes', 'heroes.id','ph.hero')
		.where({ gid })
}
