import { sample } from 'lodash'
import { goat, Hero, OpponentHero, Reward, TourneyShopItem, XSOngoingFight } from 'kingsthrone-api'
import { FClist, TourneyEndpoint } from './index'
import { XSTourneyStatus } from 'kingsthrone-api/lib/types/TourneyXS'

export class xsTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: TourneyShopItem): Promise<XSOngoingFight> {
		return goat.xsChallenges.xServerTourney.xsBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<XSOngoingFight> {
		return goat.xsChallenges.xServerTourney.xsChallengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<XSOngoingFight> {
		return goat.xsChallenges.xServerTourney.xsFightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.xsChallenges.xServerTourney.xsGetReward()
	}

	//@ts-ignore
	getTourneyInfos(): Promise<XSTourneyStatus> {
		return goat.xsChallenges.xServerTourney.xsGetTourneyInfos()
	}

	startTokenTourneyFight(): Promise<XSOngoingFight> {
		return goat.xsChallenges.xServerTourney.xsStartTokenTourneyFight()
	}

	startTourneyFight(): Promise<XSOngoingFight> {
		return goat.xsChallenges.xServerTourney.xsStartTourneyFight()
	}

	getAvailableHeroesList = async (): Promise<Hero[]> => {
		const status = await goat.xsChallenges.xServerTourney.xsGetTourneyInfos()
		const info = await goat.profile.getGameInfos()
		const heroes = info.hero.heroList
		const used = status.fclist.map((u: FClist) => u.id.toString())

		return heroes.filter((h: Hero) => !used.includes(h.id.toString()))
	}

	findAvailableHero = async (): Promise<Hero|null> => {
		const available = await this.getAvailableHeroesList()
		if (!available.length) {
			return null
		}

		return sample(available) || null
	}
}
