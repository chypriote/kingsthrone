import { goat } from 'kingsthrone-api'
import { logger } from '../services/logger'

export const readAndDeleteMail = async (): Promise<void> => {
	const mails = (await goat.profile.getGameInfos()).mail.mailList

	for (const mail of mails) {
		logger.log(`Received mail: ${mail.mtitle}`)

		try {
			if (mail.mtype === 0) { await goat.mail.openMail(mail.id) }
		} catch (e) {
			if (e.toString() === 'Error: The mail has been deleted') { continue }
			logger.error(`[MAIL] ${e}`)
		}
	}

	try {
		await goat.mail.readAllMail()
		await goat.mail.deleteAllMail()
		logger.success('Mail handled')
	} catch (e) {
		logger.error(`[MAIL] ${e}`)
	}
}
