import { goat } from '../services/goat'
import { logger } from '../services/logger'

export const readAndDeleteMail = async (): Promise<void> => {
	const mails = (await goat.profile.getGameInfos()).mail.mailList

	for (const mail of mails) {
		logger.log(`Received mail: ${mail.mtitle}`)
		if (mail.mtype === 0) { await goat.mail.openMail(mail.id) }
	}

	try {
		await goat.mail.readAllMail()
		await goat.mail.deleteAllMail()
		logger.success('Mail handled')
	} catch (e) {
		logger.error(`[MAIL] ${e}`)
	}
}
