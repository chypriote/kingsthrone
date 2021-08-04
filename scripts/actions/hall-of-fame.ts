import { goat } from 'kingsthrone-api'
import { find } from 'lodash'
import { logger } from '../services/logger'

export const payHomage = async (): Promise<void> => {
	const rankings = (await goat.profile.getGameInfos()).ranking.mobai

	const todo = []
	if (!rankings.shili) {todo.push(goat.rankings.payHomageKP())}
	if (!rankings.guanka) {todo.push(goat.rankings.payHomageCampaign())}
	if (!rankings.love) {todo.push(goat.rankings.payHomageIntimacy())}
	if (!rankings.shiliKua) {todo.push(goat.rankings.payHomageXSKP())}
	if (!rankings.clubKua) {todo.push(goat.rankings.payHomageXSAlliance())}
	if (!rankings.loveKua) {todo.push(goat.rankings.payHomageXSIntimacy())}

	try {
		await Promise.all(todo)
		if (todo.length) { logger.success('Homage in rankings paid') }
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
