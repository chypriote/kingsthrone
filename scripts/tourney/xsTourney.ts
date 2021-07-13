import { TourneyEndpoint } from '../tourney'
import { FHero, OngoingFight, TourneyReward } from '../../types/tourney'
import { Item } from '../../types/game'
import { goat } from '../services/requests'

class XsTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: Item): Promise<OngoingFight> {
		return goat.xsBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<OngoingFight> {
		return Promise.resolve(undefined)
	}

	fightHero(hero: FHero): Promise<OngoingFight> {
		return Promise.resolve(undefined)
	}

	getReward(): Promise<TourneyReward> {
		return Promise.resolve(undefined)
	}

	getTourneyInfos(): Promise<OngoingFight> {
		return Promise.resolve(undefined)
	}

	startTokenTourneyFight(): Promise<OngoingFight> {
		return Promise.resolve(undefined)
	}

	startTourneyFight(): Promise<OngoingFight> {
		return Promise.resolve(undefined)
	}

}
