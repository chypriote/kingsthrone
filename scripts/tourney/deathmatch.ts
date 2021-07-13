import { sample } from 'lodash'
import { goat } from '../services/requests'
import { TourneyEndpoint } from './index'
import { TourneyReward } from '../../types/tourney'
import { OpponentHero, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'
import { DMOngoingFight } from '../../types/goat/TourneyDM'

export class deathmatchEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<DMOngoingFight> {
		return goat.dmBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<DMOngoingFight> {
		return goat.dmChallengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<DMOngoingFight> {
		return goat.dmFightHero(hero)
	}

	getReward(): Promise<TourneyReward> {
		return goat.dmGetReward()
	}

	getTourneyInfos(): Promise<DMOngoingFight> {
		return goat.dmGetTourneyInfos()
	}

	startTokenTourneyFight(): Promise<DMOngoingFight> {
		return goat.dmStartTokenTourneyFight()
	}

	startTourneyFight(): Promise<DMOngoingFight> {
		return goat.dmStartTourneyFight()
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const info = await goat.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map(u => u.id) //jdyamen ??

		const available = heroes.filter(h => !used.includes(h.id))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
