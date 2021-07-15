import { GoatResource } from '../GoatResource'
import { GameInfos } from '../../../types/game'
import { logger } from '../logger'

export class Account extends GoatResource {
	async createAccount(server: string): Promise<void | GameInfos> {
		this._goat._setServer(server)
		const player = await this._goat.profile.getGameInfos()

		if (player.user.user.name) {
			logger.warn(`Found existing player named ${player.user.user.name} on server ${server}`)
			return player
		}

		let name = `Raymundus ${server}`
		try {
			name = await this.setName(name)
			if (!name) {
				console.log('exiting')
				process.exit()
			}
		} catch (e) {
			console.log('catching name error')
		}
		logger.debug('Skipping guide')
		await this.request({ 'user': { 'adok': { 'label': '' } }, 'rsn': '8ajixearke' })
		await this.request({ 'fuli': { 'answer': { 'code': 'tg' } }, 'rsn': '2ylhaxxbwy' })
		await this.request({ 'rsn': '9zrsjbmimms', 'guide': { 'guideUpguan': [] } })
		await this.request({ 'rsn': '8mvjxiivxm', 'guide': { 'guide': { 'gnew': 1 } } })

		logger.debug('Getting levies')
		await this.request({ 'rsn': '5yvjaevaeh', 'guide': { 'guide': { 'gnew': 2 } } })
		await this.request({ 'fuli': { 'auto_supreme': [] }, 'rsn': '8ajixejxxe' })
		await this.request({ 'user': { 'refjingying': [] }, 'rsn': '1tqrwiautk' })
		await this.request({ 'user': { 'jingYing': { 'jyid': 2 } }, 'rsn': '6wsylkxyxx' })
		await this.request({ 'rsn': '2maxwlmbmay', 'guide': { 'guide': { 'gnew': 3 } } })
		await this.request({ 'user': { 'jingYing': { 'jyid': 3 } }, 'rsn': '6xpslyusbk' })
		await this.request({ 'rsn': '1tqrwiatqu', 'guide': { 'guide': { 'gnew': 4 } } })
		await this.request({ 'user': { 'jingYing': { 'jyid': 4 } }, 'rsn': '4acmhxagbgb' })
		await this.request({ 'rsn': '3hznswfhrf', 'guide': { 'guide': { 'gnew': 5 } } })
		await this.request({ 'user': { 'adok': { 'label': '' } }, 'rsn': '8ajixekaxi' })
		await this.request({ 'user': { 'adok': { 'label': 'jingying' } }, 'rsn': '2maxwlmbhqq' })
		await this.request({ 'rsn': '6wsylkgxxx', 'guide': { 'guide': { 'smap': 0, 'bmap': 1, 'mmap': 1 } } })

		logger.debug('Campaign')
		await this.request({ 'user': { 'pve': [] }, 'rsn': '5jwfvajwyyf' })
		await this.request({ 'rsn': '8mvjxiekxm', 'guide': { 'guide': { 'gnew': 6 } } })
		await this.request({ 'user': { 'adok': { 'label': 'jingying' } }, 'rsn': '3hznswfeke' })
		await this.request({ 'user': { 'adok': { 'label': '' } }, 'rsn': '4cavxbmfhv' })
		await this.request({ 'user': { 'adok': { 'label': 'jingying' } }, 'rsn': '5yvjaerpay' })
		await this.request({ 'rsn': '5yvjaereyf', 'guide': { 'guide': { 'gnew': 7 } } })

		logger.debug('Upgrade Gerard')
		await this.request({ 'hero': { 'upgrade': { 'id': 2 } }, 'rsn': '1qtaewqtqwk' })
		await this.request({ 'rsn': '5yvjaereyf', 'guide': { 'guide': { 'gnew': 7 } } })
		await this.request({ 'user': { 'adok': { 'label': '' } }, 'rsn': '8ajixekkoe' })


		logger.debug('Fight Boss')
		await this.request({ 'user': { 'pvb': { 'is_guide': 1, 'id': 2 } }, 'rsn': '4acmhxacvgb' })
		await this.request({ 'user': { 'adok': { 'label': '' } }, 'rsn': '5jwfvajvrhh' })
		await this.request({ 'user': { 'adok': { 'label': '' } }, 'rsn': '9zrsjbzjics' })

		logger.debug('Collect quest 1')
		await this.request({ 'task': { 'taskdo': { 'id': 1 } }, 'rsn': '6swgplswlux' })
		await this.request({ 'rsn': '5jwfvajvaff', 'guide': { 'guide': { 'gnew': 8 } } })

		logger.success(`Created ${name} on server ${server}`)
	}

	async getGeneratedName(): Promise<string> {
		const name = await this.request({ 'rsn': '6xpsluwksy', 'guide': { 'randName': { 'sex': 1 } } })

		return name.a.system.randname.name
	}

	async setName(name: string): Promise<string> {
		await this.request({ 'rsn': '6xpsluwkyk', 'guide': { 'setUinfo': { 'sex': 1, name, 'job': 7 } } })

		return name
	}
}
