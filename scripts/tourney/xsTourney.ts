import { sample } from 'lodash'
import { goat } from '../services/goat'
import { TourneyEndpoint } from './index'
import { OpponentHero, Reward, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'
import { XSOngoingFight } from '../../types/goat/TourneyXS'

export class xsTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<XSOngoingFight> {
		return goat.challenges.xServerTourney.xsBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<XSOngoingFight> {
		return goat.challenges.xServerTourney.xsChallengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<XSOngoingFight> {
		return goat.challenges.xServerTourney.xsFightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.challenges.xServerTourney.xsGetReward()
	}

	getTourneyInfos(): Promise<XSOngoingFight> {
		return goat.challenges.xServerTourney.xsGetTourneyInfos()
	}

	startTokenTourneyFight(): Promise<XSOngoingFight> {
		return goat.challenges.xServerTourney.xsStartTokenTourneyFight()
	}

	startTourneyFight(): Promise<XSOngoingFight> {
		return goat.challenges.xServerTourney.xsStartTourneyFight()
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const info = await goat.profile.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map(u => u.id) //kuayamen ??

		const available = heroes.filter(h => !used.includes(h.id))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
