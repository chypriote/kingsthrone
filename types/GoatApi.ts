import { Account, Alliance, Children, Dungeon, Expeditions, Feasts, HallOfFame, Items, Kingdom, Maidens, Mail, Processions, Profile, Rankings, Rewards, Tourney, WorldBoss, XServerTourney, Deathmatch, DarkCastle, GardenStroll, Picnic, TreasureHunt } from '../scripts/services/endpoints'

export interface GoatApi {
	cookie: string
	token: string | null
	gid: string | null

	host: string
	server: string
	version: string

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
	}
}
