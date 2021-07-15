import { GoatApi } from '~/types/GoatApi'
import {
	Account, Alliance, Children, Dungeon, Expeditions, Feasts,
	HallOfFame, Items, Kingdom, Maidens, Mail, Processions, Profile,
	Rankings, Rewards, Tourney, WorldBoss, XServerTourney, Deathmatch,
	DarkCastle, GardenStroll, Picnic, TreasureHunt
} from './endpoints'

const VERSION = 'V1.3.559'
const COOKIE = 'lyjxncc=c3ac4e77dff349b66c7aeed276e3eb6c'
const DEFAULT_HOST = 'ksrus.gtbackoverseas.com'
// const OLD_HOST = 'zsjefunbm.zwformat.com'

export class Goat implements GoatApi {
	cookie: string
	token: string|null = null
	gid: string|null = null

	host: string
	server: string
	version: string

	isLoggedIn = false

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

	constructor() {
		this.version = VERSION
		this.cookie = COOKIE
		this.host = DEFAULT_HOST

		this.server = '699'
		this.token = null
		this.gid = null


		this.account = new Account(this)
		this.alliance = new Alliance(this)
		this.children = new Children(this)
		this.dungeon = new Dungeon(this)
		this.expeditions = new Expeditions(this)
		this.feasts = new Feasts(this)
		this.hallOfFame = new HallOfFame(this)
		this.items = new Items(this)
		this.kingdom = new Kingdom(this)
		this.maidens = new Maidens(this)
		this.mail = new Mail(this)
		this.processions = new Processions(this)
		this.profile = new Profile(this)
		this.rankings = new Rankings(this)
		this.rewards = new Rewards(this)
		this.tourney = new Tourney(this)
		this.worldBoss = new WorldBoss(this)

		this.challenges = {
			xServerTourney: new XServerTourney(this),
			deathmatch: new Deathmatch(this),
		}

		this.events = {
			darkCastle: new DarkCastle(this),
			gardenStroll: new GardenStroll(this),
			picnic: new Picnic(this),
			treasureHunt: new TreasureHunt(this),
		}
	}
	_setServer(server: string): this {
		this.server = server
		return this
	}
	_setVersion(version: string): this {
		this.version = version
		return this
	}
	_setGid(gid: string): this {
		this.gid = gid === '691005139' ? '691005130' : gid
		return this
	}
	_setToken(token: string): this {
		this.token = token
		this.isLoggedIn = true
		return this
	}
	_getBaseUrl(): string {
		return `http://${this.host}/servers/s${this.server}.php`
	}
}
