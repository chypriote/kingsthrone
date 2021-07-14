import { sample } from 'lodash'
import { goat } from '../services/requests'
import { TourneyEndpoint } from './index'
import { OpponentHero, Reward, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'
import { XSOngoingFight } from '../../types/goat/TourneyXS'

export class xsTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<XSOngoingFight> {
		return goat.xsBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<XSOngoingFight> {
		return goat.xsChallengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<XSOngoingFight> {
		return goat.xsFightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.xsGetReward()
	}

	getTourneyInfos(): Promise<XSOngoingFight> {
		return goat.xsGetTourneyInfos()
	}

	startTokenTourneyFight(): Promise<XSOngoingFight> {
		return goat.xsStartTokenTourneyFight()
	}

	startTourneyFight(): Promise<XSOngoingFight> {
		return goat.xsStartTourneyFight()
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const info = await goat.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map(u => u.id) //kuayamen ??

		const available = heroes.filter(h => !used.includes(h.id))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
