import { sample } from 'lodash'
import { goat, DMOngoingFight, Hero, OpponentHero, Reward, TourneyShopItem } from 'kingsthrone-api'
import { FClist, TourneyEndpoint } from './index'

export class deathmatchEndpoint implements TourneyEndpoint {
	buyTourneyBoost(item: TourneyShopItem): Promise<DMOngoingFight> {
		return goat.events.deathmatch.dmBuyTourneyBoost(item)
	}

	challengeOpponent(opponent: string, hero: number): Promise<DMOngoingFight> {
		return goat.events.deathmatch.dmChallengeOpponent(opponent, hero)
	}

	fightHero(hero: OpponentHero): Promise<DMOngoingFight> {
		return goat.events.deathmatch.dmFightHero(hero)
	}

	getReward(): Promise<Reward> {
		return goat.events.deathmatch.dmGetReward()
	}

	getTourneyInfos(): Promise<DMOngoingFight> {
		return goat.events.deathmatch.dmGetTourneyInfos()
	}

	startTokenTourneyFight(): Promise<DMOngoingFight> {
		return goat.events.deathmatch.dmStartTokenTourneyFight()
	}

	startTourneyFight(): Promise<DMOngoingFight> {
		return goat.events.deathmatch.dmStartTourneyFight()
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
