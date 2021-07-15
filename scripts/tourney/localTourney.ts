import { sample } from 'lodash'
import { goat } from '../services/goat'
import { TourneyEndpoint } from './index'
import { ITourneyStatus, OpponentHero, Reward, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'

export class LocalTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<ITourneyStatus> {
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
		const used = info.yamen.fclist.map(u => u.id)

		const available = heroes.filter(h => !used.includes(h.id))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
