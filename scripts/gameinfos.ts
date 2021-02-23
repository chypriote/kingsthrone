import { config } from 'dotenv'
config()
import { logger } from './services/logger'
import { client } from './services/requests'
import { getPlayerByGID } from './repository/player'
import { createOrUpdateHero } from '~/scripts/repository/hero'

export const updateHeroList = async(): Promise<void> => {
	const game = await client.getGameInfos()
	const me = await getPlayerByGID(game.user.user.uid)

	for (const hero of game.hero.heroList) {
		await createOrUpdateHero(hero, me)
	}

	logger.success('Finished')
}

updateHeroList().then(() => process.exit())
