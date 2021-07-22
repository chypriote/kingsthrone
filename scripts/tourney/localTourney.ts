import { sample } from 'lodash'
import { goat, Hero, ITourneyStatus, OpponentHero, Reward, TourneyShopItem } from 'kingsthrone-api'
import { FClist, TourneyEndpoint } from './index'

export class LocalTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: TourneyShopItem): Promise<ITourneyStatus> {
		return goat.tourney.buyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<ITourneyStatus> {
		return goat.tourney.challengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<ITourneyStatus> {
		return goat.tourney.fightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.tourney.getReward()
	}

	getTourneyInfos(): Promise<ITourneyStatus> {
		return goat.tourney.getTourneyInfos()
	}

	startTokenTourneyFight(): Promise<ITourneyStatus> {
		return goat.tourney.startTokenTourneyFight()
	}

	startTourneyFight(): Promise<ITourneyStatus> {
		return goat.tourney.startTourneyFight()
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const info = await goat.profile.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map((u: FClist) => u.id.toString())

		const available = heroes.filter((h: Hero) => !used.includes(h.id.toString()))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
