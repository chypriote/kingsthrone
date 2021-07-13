import { sample } from 'lodash'
import { goat } from '../services/requests'
import { TourneyEndpoint } from './index'
import { OngoingFight } from '../../types/tourney'
import { OpponentHero, Reward, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'

export class LocalTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<OngoingFight> {
		return goat.buyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<OngoingFight> {
		return goat.challengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<OngoingFight> {
		return goat.fightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.getReward()
	}

	getTourneyInfos(): Promise<OngoingFight> {
		return goat.getTourneyInfos()
	}

	startTokenTourneyFight(): Promise<OngoingFight> {
		return goat.startTokenTourneyFight()
	}

	startTourneyFight(): Promise<OngoingFight> {
		return goat.startTourneyFight()
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const info = await goat.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map(u => u.id)

		const available = heroes.filter(h => !used.includes(h.id))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
