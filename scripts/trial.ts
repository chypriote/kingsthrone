import { chunk, find, reduce } from 'lodash'
import { Goat } from 'kingsthrone-api/lib'
import { client } from './services/database'
import winston from 'winston'
import { HeroesTrialStatus } from 'kingsthrone-api/lib/types/Events'
import { HeroesTrialFightResult } from 'kingsthrone-api'

const w = winston.createLogger({
	level: 'info',
	format: winston.format.simple(),
	transports: [],
})
w.add(new winston.transports.File({
	filename: 'trial.csv',
}))

const recordBoss = async (server: number|string): Promise<void> => {
	const goat = new Goat()
	goat._setServer(server.toString())
	await goat.account.createAccount(server.toString())

	try {
		const event: HeroesTrialStatus = await goat.events.heroesTrial.eventInfos()

		await goat.events.heroesTrial.selectHero(1)
		const fight: HeroesTrialFightResult = await goat.events.heroesTrial.fight(1)

		const ranks = await goat.rankings.getLadderKP(true)
		const average = reduce(ranks, (sum, rank) => sum + parseInt(rank.shili.toString()), 0)
		const opponent = find(fight.fight.base, op => op.hid === 0) || fight.fight.base[0]
		w.info(`${server},${event.info.bossId},${opponent.hpmax},${ranks[0].shili},${ranks[10].shili},${ranks[ranks.length - 1].shili},${average / ranks.length}`)
	} catch (e) {
		console.log(e)
		w.info(`${server},ERROR,ERROR,ERROR`)
	}
}

const logTrials = async (): Promise<void> => {
	const servers = (await client('servers')
		.min('id')
		.groupBy('merger')
		.orderBy('min')).map(sv => sv.min)

	w.info('Server,Boss,Boss HP,1st player,11th player,100th player,Server average')
	const chunks: number[][] = chunk(servers, 20)
	for (const ck of chunks) {
		const promises = []
		for (const server of ck) {
			promises.push(recordBoss(server))
		}
		await Promise.all(promises)
	}
}

logTrials().then(() => {process.exit()})
