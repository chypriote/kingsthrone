import { ITourneyStatus, OpponentHero, Reward, ShopItem } from '../../types/goat/Tourney'
import { Hero } from '../../types/goat/Hero'

export { xsTourneyEndpoint } from './xsTourney'
export { LocalTourneyEndpoint } from './localTourney'
export { deathmatchEndpoint } from './deathmatch'
export { doTourney } from './fight'

export interface TourneyEndpoint {
	buyTourneyBoost(item: ShopItem): Promise<ITourneyStatus>
	fightHero(hero: OpponentHero): Promise<ITourneyStatus>
	getReward(): Promise<Reward>
	getTourneyInfos(): Promise<ITourneyStatus>
	challengeOpponent(opponent: string, hero: number): Promise<ITourneyStatus>
	startTokenTourneyFight(): Promise<ITourneyStatus>
	startTourneyFight(): Promise<ITourneyStatus>
	findAvailableHero(): Promise<Hero|null>
}
