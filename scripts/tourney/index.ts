import { Hero, ITourneyStatus, OpponentHero, Reward, TourneyShopItem } from 'kingsthrone-api'

export { xsTourneyEndpoint } from './xsTourney'
export { LocalTourneyEndpoint } from './localTourney'
export { deathmatchEndpoint } from './deathmatch'
export { doTourney } from './fight'

export interface TourneyEndpoint {
	buyTourneyBoost(item: TourneyShopItem): Promise<ITourneyStatus>
	fightHero(hero: OpponentHero): Promise<ITourneyStatus>
	getReward(): Promise<Reward>
	getTourneyInfos(): Promise<ITourneyStatus>
	challengeOpponent(opponent: string, hero: number): Promise<ITourneyStatus>
	startTokenTourneyFight(): Promise<ITourneyStatus>
	startTourneyFight(): Promise<ITourneyStatus>
	findAvailableHero(): Promise<Hero|null>
}

export interface FClist {
	id: number, h: number, f: number
}
