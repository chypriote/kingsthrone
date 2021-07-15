import { Account, Alliance, Children, Dungeon, Expeditions, Feasts, HallOfFame, Items, Kingdom, Maidens, Mail, Processions, Profile, Rankings, Rewards, Tourney, WorldBoss, XServerTourney, Deathmatch, DarkCastle, GardenStroll, Picnic, TreasureHunt, Renovation } from '../scripts/services/endpoints'

export interface GoatApi {
	isLoggedIn: boolean

	account: Account
	alliance: Alliance
	children: Children
	dungeon: Dungeon
	expeditions: Expeditions
	feasts: Feasts
	hallOfFame: HallOfFame
	items: Items
	kingdom: Kingdom
	maidens: Maidens
	mail: Mail
	processions: Processions
	profile: Profile
	rankings: Rankings
	rewards: Rewards
	tourney: Tourney
	worldBoss: WorldBoss

	challenges: {
		xServerTourney: XServerTourney
		deathmatch: Deathmatch
	}

	events: {
		darkCastle: DarkCastle
		gardenStroll: GardenStroll
		picnic: Picnic
		treasureHunt: TreasureHunt
		castle: Renovation
	}

	_setServer(server: string): this
	_getServer(): string
	_setVersion(version: string): this
	_getVersion(): string
	_setGid(gid: string): this
	_getGid(): string|null
	_setToken(token: string): this
	_getToken(): string|null
}
