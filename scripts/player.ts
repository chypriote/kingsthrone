import { config } from 'dotenv'
config()
import { goat, LOGIN_ACCOUNT_GAUTIER } from './services/goat'
import { logger } from './services/logger'
import { createOrUpdateMyHero } from './repository/roster'

export const updateHeroList = async (): Promise<void> => {
	await goat.profile.login(LOGIN_ACCOUNT_GAUTIER)
	const game = await goat.profile.getGameInfos()
	const heroList = game.hero.heroList

	for (const hero of heroList) {
		await createOrUpdateMyHero(hero)
	}

	logger.success('Finished')
}

updateHeroList().then(() => process.exit())
