import { getProfile, login } from './services/requests'

login('699').then(async response => {
	console.log(response)

	const user = await getProfile(response.uid)
	console.log(user)
	process.exit()
})
