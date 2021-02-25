import { config } from 'dotenv'
config()
import { client } from './services/requests'
import { logger } from './services/logger'
import { createOrUpdateMyHero } from './repository/roster'

export const updateHeroList = async (): Promise<void> => {
	const game = await client.getGameInfos()
	const heroList = game.hero.heroList

	for (const hero of heroList) {
		await createOrUpdateMyHero(hero)
	}

	logger.success('Finished')
}

updateHeroList().then(() => process.exit())
