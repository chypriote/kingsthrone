import { goat, User } from 'kingsthrone-api'
import { Player } from '../types/strapi/Player'
import { UserProfile } from 'kingsthrone-api/lib/types/User'
import { logger } from './services/logger'
import { updatePlayerAlliance } from './update/profiles'
import { createPlayer, getPlayerByGID, updatePlayerDetails } from './repository/player'
import { differenceInHours } from 'date-fns'

const createPlayerFromProfile = async (profile: UserProfile): Promise<Player> => {
	const gid = profile.id
	await createPlayer(gid, profile.name, profile.vip, profile.shili, profile.hero_num, parseInt(goat._getServer()))

	logger.success(`Created ${profile.name}`)
	return await getPlayerByGID(gid)
}

const handleUser = async (user: User): Promise<void> => {
	let player: Player|null = await getPlayerByGID(user.uid)
	const profile = await goat.profile.getUser(user.uid)

	if (!profile) { return }
	if (player && differenceInHours(new Date(), new Date(player.updated_at)) < 3) { console.log(player); return }
	if (!player) {
		player = await createPlayerFromProfile(profile)
	}

	await Promise.all([
		updatePlayerDetails(player, profile),
		updatePlayerAlliance(player, profile),
	])
	logger.success(`Updated ${profile.name}`)
}

const recordServerLadder = async (server: string): Promise<void> => {
	goat._logout()
	await goat.account.createAccount(server)

	const ranks = await goat.rankings.getLadderKP()

	for (const user of ranks) {
		await handleUser(user)
	}
}

const logServers = async (): Promise<void> => {
	for (const server of [
		// 70,
		// 103,
		// 188,
		// 252,
		256,
		278,
		293,
		321,
		368,
		377,
		383,
		390,
		428,
		437,
		479,
		481,
		537,
		544,
		685,
		736,
		853,
		1010,
	]) {
		await recordServerLadder(server.toString())
	}
}

logServers().then(() => {process.exit()})
