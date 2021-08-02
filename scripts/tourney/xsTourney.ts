import { sample } from 'lodash'
import { goat, Hero, OpponentHero, Reward, TourneyShopItem, XSOngoingFight } from 'kingsthrone-api'
import { FClist, TourneyEndpoint } from './index'

export class xsTourneyEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: TourneyShopItem): Promise<XSOngoingFight> {
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

	getAvailableHeroesList = async (): Promise<Hero[]> => {
		const info = await goat.profile.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map((u: FClist) => u.id.toString())  //kuayamen ??

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
