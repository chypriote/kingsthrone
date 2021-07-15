import { GoatApi } from '~/types/GoatApi'
import {
	Account, Alliance, Children, Dungeon, Expeditions, Feasts,
	HallOfFame, Items, Kingdom, Maidens, Mail, Processions, Profile,
	Rankings, Rewards, Tourney, WorldBoss, XServerTourney, Deathmatch,
	DarkCastle, GardenStroll, Picnic, TreasureHunt, Renovation
} from './endpoints'

export const LOGIN_ACCOUNT_GAUTIER = { 'rsn':'2ylxannmqx','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc', 'parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15', 'parm3':'ONEPLUS A5000','openid':'563125632849524101', 'openkey':'6b66102c0d0e963ee2f6ebe96a2344917c3faca4' } } }
export const LOGIN_ACCOUNT_NAPOLEON = { 'rsn':'2axwqwhxyx','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc', 'parm2':'GooglePlay','parm6':'4c4fbcab-ab57-3f8c-8447-f675203edc15', 'parm3':'ONEPLUS A5000','openid':'565939577188654916', 'openkey':'b4d47e9c7beaf15e97f899c8cd4f2bbc4f31c3bc' } } }
export const LOGIN_ACCOUNT_701 = { 'rsn':'2maymbhnxnb','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'82557521-a0b4-3441-a774-840066252311','parm3':'ONEPLUS A5000','openid':'565939577188654916','openkey':'deb43d3a1b48b2f80d01ae6829834e9a309019f8' } } }
export const LOGIN_ACCOUNT_RAYMUNDUS = { 'rsn':'7xcxcypvslg','login':{ 'loginAccount':{ 'parm1':'WIFI','platform':'gaotukc','parm2':'GooglePlay','parm6':'2630f405-13ed-3867-90e5-325059450d8e','parm3':'ONEPLUS A5000','openid':'573218842929144928','openkey':'78c249945d8d450de2111c2eebaa653b697f40c1' } } }


const VERSION = 'V1.3.559'
const COOKIE = 'lyjxncc=c3ac4e77dff349b66c7aeed276e3eb6c'
const DEFAULT_HOST = 'ksrus.gtbackoverseas.com'
// const OLD_HOST = 'zsjefunbm.zwformat.com'

export class Goat implements GoatApi {
	private readonly cookie: string
	private token: string|null = null
	private gid: string|null = null

	private readonly host: string
	private server: string
	private version: string

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
		castle: Renovation
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
			castle: new Renovation(this),
		}
	}
	_getHost(): string { return this.host}
	_getCookie(): string { return this.cookie}
	_getServer(): string { return this.server}
	_setServer(server: string): this {
		this.server = server
		return this
	}
	_getVersion(): string { return this.version}
	_setVersion(version: string): this {
		this.version = version
		return this
	}
	_getGid(): string|null { return this.gid}
	_setGid(gid: string): this {
		this.gid = gid === '691005139' ? '691005130' : gid
		return this
	}
	_getToken(): string|null { return this.token}
	_setToken(token: string): this {
		this.token = token
		this.isLoggedIn = true
		return this
	}
	_getBaseUrl(): string {
		return `http://${this.host}/servers/s${this.server}.php`
	}
	_isGautier(): boolean {
		return this.gid === '699002934'
	}
}

export const goat = new Goat()
