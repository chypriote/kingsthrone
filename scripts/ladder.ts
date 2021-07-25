import { goat, User } from 'kingsthrone-api'
import { differenceInHours } from 'date-fns'
import { UserProfile } from 'kingsthrone-api/lib/types/User'
import { Player } from '../types/strapi/Player'
import { logger } from './services/logger'
import { updatePlayerAlliance } from './update/profiles'
import { createPlayer, getPlayerByGID, updatePlayerDetails } from './repository/player'

const getServer = (gid: string): string => {
	switch (gid.length) {
	case 7: return gid.toString().substr(0, 1)
	case 8: return gid.toString().substr(0, 2)
	case 10: return gid.toString().substr(0, 4)
	case 9:
	default:
		return gid.toString().substr(0, 3)
	}
}

const createPlayerFromProfile = async (profile: UserProfile): Promise<Player> => {
	const gid = profile.id
	await createPlayer(
		gid,
		profile.name,
		profile.vip,
		profile.shili,
		profile.hero_num,
		getServer(gid)
	)

	logger.success(`Created ${profile.name} (${gid}) on ${getServer(gid)}`)
	return await getPlayerByGID(gid)
}

const handleUser = async (user: User): Promise<void> => {
	let player: Player|null = await getPlayerByGID(user.uid)
	const profile = await goat.profile.getUser(user.uid)

	if (!profile) { return }
	if (player && differenceInHours(new Date(), new Date(player.updated_at)) < 3) { return }
	if (!player) {
		player = await createPlayerFromProfile(profile)
	}

	await Promise.all([
		updatePlayerDetails(player, profile),
		updatePlayerAlliance(player, profile),
	])
	logger.success(`Updated ${profile.name}`)
}

const recordServerLadder = async (server: number|string): Promise<void> => {
	goat._logout()
	goat._setServer(server.toString())
	await goat.account.createAccount(server.toString())

	const ranks = await goat.rankings.getLadderKP(true)

	for (const user of ranks) {
		await handleUser(user)
	}
}

const logServers = async (): Promise<void> => {
	for (let i = 1086; i < 1090; i++) {
		await recordServerLadder(i)
		if (i < 829) { i = i + 2}
	}
}

logServers().then(() => {process.exit()})
