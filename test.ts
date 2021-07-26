import { logger } from './scripts/services/logger'
import axios from 'axios'
import { client } from './scripts/services/database'
import { fromUnixTime } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { ACCOUNT_GAUTIER } from 'kingsthrone-api/lib/src/goat'
import { Progress } from './scripts/services/progress'

interface GoatServer {
	he: number
	id: number
	name: string
	showtime: number
	state: number
	skin: number
	url: string
}

const getServers = async (): Promise<GoatServer[]> => {
	const servers = await axios.post(
		'http://ksrus.gtbackoverseas.com/serverlist.php?platform=gaotukc&lang=1',
		{
			platform: 'gaotukc',
			lang: 1,
		}, {
			headers: {
				'Accept-Encoding': 'identity',
				'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.1; ONEPLUS A5000 Build/NMF26X)',
				'Content-Length': 0,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Connection': 'Keep-Alive',
				'Host': 'ksrus.gtbackoverseas.com',
			},
		}
	).then(response => response.data)
	return servers.a.system.server_list
}

const logServer = async () => {
	const servers = await getServers()

	for (const server of servers) {
		await client('servers')
			.insert({
				id: server.id,
				name: server.name,
				time: fromUnixTime(server.showtime),
				merger: server.he,
			})
	}
}

const spamAllianceSiege = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const todo = 100
	const progress = new Progress('Attacking', todo)
	for (let i = 0; i < todo; i++) {
		await goat.challenges.allianceSiege.buySiegeWeapon(10)
		await goat.challenges.allianceSiege.attackMember('1035002191', 10)
		progress.increment()
	}
	progress.stop()
}
const doTest = async () => {
	goat._setAccount(ACCOUNT_GAUTIER)
	const progress = new Progress('Buying packs', 97)
	for (let i = 0; i < 78; i++) {
		await goat.shop.buyShopPack(1)
		progress.increment()
	}
	progress.stop()
}

spamAllianceSiege().then(() => { logger.success('Finished'); process.exit() })
