import { GoatRequest } from './services/requests'

const Server699 = new GoatRequest('699')

Server699.getProfile(699002934).then(response => {
	console.log(response)
	process.exit()
})
