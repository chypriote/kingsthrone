import { sample } from 'lodash'
import { goat } from '../services/goat'
import { TourneyEndpoint } from './index'
import { OpponentHero, Reward, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'
import { DMOngoingFight } from '../../types/goat/TourneyDM'

export class deathmatchEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<DMOngoingFight> {
		return goat.challenges.deathmatch.dmBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<DMOngoingFight> {
		return goat.challenges.deathmatch.dmChallengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<DMOngoingFight> {
		return goat.challenges.deathmatch.dmFightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.challenges.deathmatch.dmGetReward()
	}

	getTourneyInfos(): Promise<DMOngoingFight> {
		return goat.challenges.deathmatch.dmGetTourneyInfos()
	}

	startTokenTourneyFight(): Promise<DMOngoingFight> {
		return goat.challenges.deathmatch.dmStartTokenTourneyFight()
	}

	startTourneyFight(): Promise<DMOngoingFight> {
		return goat.challenges.deathmatch.dmStartTourneyFight()
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const info = await goat.profile.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map(u => u.id) //jdyamen ??

		const available = heroes.filter(h => !used.includes(h.id))
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
