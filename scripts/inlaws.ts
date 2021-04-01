import { client, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './services/requests'
import { logger } from './services/logger'

export const visitInLaws = async (): Promise<void> => {
	await client.login(LOGIN_ACCOUNT_NAPOLEON)
	const inLawsNapoleon = await client.getInLaws()
	for (const inLaw of inLawsNapoleon) {
		if (inLaw.num3 === 1) { continue }
		await client.visitInLaw(inLaw.uid)
		console.log(`Visited inLaw ${inLaw.name} (${inLaw.uid})`)
	}
	logger.success(`Finished visited ${inLawsNapoleon.length} inLaws`)

	await client.login(LOGIN_ACCOUNT_GAUTIER)
	const inLawsGautier = await client.getInLaws()
	for (const inLaw of inLawsGautier) {
		if (inLaw.num3 === 1) { continue }
		await client.visitInLaw(inLaw.uid)
		console.log(`Visited inLaw ${inLaw.name} (${inLaw.uid})`)
	}
	logger.success(`Finished visited ${inLawsGautier.length} inLaws`)
}


visitInLaws().then(() => process.exit())
