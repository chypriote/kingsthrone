import { client } from '../services/database'
import { Hero } from '../../types/Hero'
import { Player } from '../../types/Player'

export const updatePlayerHero = async (hid: number, gid: string, quality: number): Promise<void> => {
	const hero: Hero = (await client('heroes').where({ hid }).limit(1))[0]
	const player: Player = (await client('players').where({ gid }).limit(1))[0]

	if (!hero || !player) {
		throw new Error(`Invalid values: hero ${hid} player ${gid}`)
	}
	const existing = await client('player_heroes as ph').where({ player: player.id, hero: hero.id }).limit(1)

	if (existing.length) {
		await client('player_heroes').update({ quality }).where({ player: player.id, hero: hero.id })
	} else {
		await client('player_heroes as ph').insert({ quality, player: player.id, hero: hero.id })
	}
}
