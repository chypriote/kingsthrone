import { config } from 'dotenv'
config()
import { goat } from 'kingsthrone-api'
import { logger } from './services/logger'
import { createOrUpdateMyHero } from './repository/roster'

export const updateHeroList = async (): Promise<void> => {
	const heroes = (await goat.profile.getGameInfos()).hero.heroList

	for (const hero of heroes) {
		await createOrUpdateMyHero(hero)
	}

	logger.success('Finished')
}

updateHeroList().then(() => process.exit())
