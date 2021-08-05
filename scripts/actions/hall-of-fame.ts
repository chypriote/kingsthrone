import { goat } from 'kingsthrone-api'
import { find } from 'lodash'
import { logger } from '../services/logger'

export const payHomage = async (): Promise<void> => {
	const rankings = (await goat.profile.getGameInfos()).ranking.mobai

	try {
		if (!rankings.shili) {await goat.rankings.payHomageKP()}
		if (!rankings.guanka) {await goat.rankings.payHomageCampaign()}
		if (!rankings.love) {await goat.rankings.payHomageIntimacy()}
		if (!rankings.shiliKua) {await goat.rankings.payHomageXSKP()}
		if (!rankings.clubKua) {await goat.rankings.payHomageXSAlliance()}
		if (!rankings.loveKua) {await goat.rankings.payHomageXSIntimacy()}

		logger.success('Homage in rankings paid')
	} catch (e) {
		logger.error(`[RANKINGS] ${e}`)
	}
}

export const HallOfFame = async (): Promise<void> => {
	try {
		const status = (await goat.profile.getGameInfos()).huanggong.qingAn.type
		if (status === 1) { return }

		const titles = await goat.hallOfFame.getHoFInfo()
		const mine = find(titles, t => t.uid === goat._getGid())

		if (!mine) {
			await goat.hallOfFame.payHomage(titles[0].uid, titles[0].id)
			logger.success('HoF homage paid')
			return
		}

		await goat.hallOfFame.payHomage(mine.uid, mine.id)
		await goat.hallOfFame.claimHomage()
		logger.success('HoF homage paid and claimed')
	} catch (e) {
		logger.error(`[HOF] ${e}`)
	}
}
