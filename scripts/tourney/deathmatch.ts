import { sample } from 'lodash'
import { goat, DMOngoingFight, Hero, OpponentHero, Reward, TourneyShopItem } from 'kingsthrone-api'
import { FClist, TourneyEndpoint } from './index'

export class deathmatchEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: TourneyShopItem): Promise<DMOngoingFight> {
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

	getAvailableHeroesList = async (): Promise<Hero[]> => {
		const info = await goat.profile.getGameInfos()
		const heroes = info.hero.heroList
		const used = info.yamen.fclist.map((u: FClist) => u.id.toString())  //jdyamen ??

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
