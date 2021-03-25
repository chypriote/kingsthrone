import { client, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON, LOGIN_ACCOUNT_RAYMUNDUS } from './services/requests'
import { logger } from './services/logger'

const account = LOGIN_ACCOUNT_NAPOLEON

export const visitInLaws = async (): Promise<void> => {
	// client.setServer('775')
	await client.login(account)
	const inLaws = await client.getInLaws()

	for (const inLaw of inLaws) {
		if (inLaw.num3 === 1) { continue }
		await client.visitInLaw(inLaw.uid)
		console.log(`Visited inLaw ${inLaw.name} (${inLaw.uid})`)
	}

	logger.success(`Finished visited ${inLaws.length} inLaws`)
}


visitInLaws().then(() => process.exit())
