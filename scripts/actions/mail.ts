import { goat } from '../services/requests'
import { logger } from '../services/logger'

export const readAndDeleteMail = async (): Promise<void> => {
	const mails = (await goat.getGameInfos()).mail.mailList

	for (const mail of mails) {
		logger.log(`Received mail: ${mail.mtitle}`)
		if (mail.mtype === 0) { await goat.openMail(mail.id) }
	}

	try {
		await goat.readAllMail()
		await goat.deleteAllMail()
		logger.success('Mail handled')
	} catch (e) {
		logger.error(`[MAIL] ${e}`)
	}
}
