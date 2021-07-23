import { logger } from './scripts/services/logger'
import axios from 'axios'
import { client } from './scripts/services/database'
import { fromUnixTime } from 'date-fns'

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

const doTest = async () => {
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


doTest().then(() => { logger.success('Finished'); process.exit() })
