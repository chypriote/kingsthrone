import { config } from 'dotenv'
config()
import { client, LOGIN_ACCOUNT_GAUTIER } from './services/requests'
import { logger } from './services/logger'
import { createOrUpdateMyHero } from './repository/roster'

export const updateHeroList = async (): Promise<void> => {
	await client.login(LOGIN_ACCOUNT_GAUTIER)
	const game = await client.getGameInfos()
	const heroList = game.hero.heroList

	for (const hero of heroList) {
		await createOrUpdateMyHero(hero)
	}

	logger.success('Finished')
}

updateHeroList().then(() => process.exit())
