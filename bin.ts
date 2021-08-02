#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-empty-function */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { format } from 'date-fns'
import { goat } from 'kingsthrone-api'
import { ACCOUNT_GAUTIER, ACCOUNT_NAPOLEON } from 'kingsthrone-api/lib/src/goat'
import { dailyChores } from './scripts/daily'
import { doTourney } from './scripts/tourney'
import { doProcessions, visitMaidens } from './scripts/actions'
import { doKingdom } from './scripts/actions/kingdom'
import { getGems } from './scripts/actions/gems'
import { allTourney, TOURNEY_TYPE } from './scripts/tourney/fight'
import { doEvents } from './scripts/events'
import { logger } from './scripts/services/logger'

function login(account: string|null = null, server: string) {
	goat._setServer(server)
	goat._setAccount(account === 'gautier' ? ACCOUNT_GAUTIER : ACCOUNT_NAPOLEON)
}

yargs(hideBin(process.argv))
	.option('account', {
		description: 'account used',
		default: 'demophlos',
		alias: 'a',
		type: 'string',
	})
	.option('server', {
		description: 'server to play on',
		default: '699',
		alias: 's',
		type: 'string',
	})
	.command('full', 'Runs daily chores, kingdom and tourney', () => {}, async (argv) => {
		login(argv.account, argv.server)

		await doKingdom()
		await doTourney(TOURNEY_TYPE.LOCAL)
		await dailyChores()
		await doEvents()
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Daily
	.command('daily', 'Run daily chores', () => {}, async (argv) => {
		login(argv.account, argv.server)

		await dailyChores()
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Kingdom
	.command('kingdom', 'Explore the kingdom', () => {}, async (argv) => {
		login(argv.account, argv.server)

		await doKingdom()
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Events
	.command('events', 'Do events', () => {}, async (argv) => {
		login(argv.account, argv.server)

		await doEvents()
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})

	//Tourney
	.command('tourney', 'Do tourney', (yargs) => {
		return yargs.option('opponent', {
			description: 'ID of the opponent to challenge',
			alias: 'o',
			type: 'string',
			default: null,
		}).option('hero', {
			description: 'ID of the hero that will challenge',
			alias: 'h',
			type: 'number',
			default: null,
		}).boolean('all')
	}, async (argv) => {
		login(argv.account, argv.server)

		if (argv.all) {
			await allTourney(TOURNEY_TYPE.LOCAL, argv.opponent)
			logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
			process.exit()
		}

		await doTourney(TOURNEY_TYPE.LOCAL, argv.opponent, argv.hero)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Deathmatch
	.command('deathmatch', 'Fight in DeathMatch', (yargs) => {
		return yargs.option('opponent', {
			description: 'ID of the opponent to challenge',
			alias: 'o',
			type: 'string',
			default: null,
		}).option('hero', {
			description: 'ID of the hero that will challenge',
			alias: 'h',
			type: 'number',
			default: null,
		})
	}, async (argv) => {
		login(argv.account, argv.server)

		await doTourney(TOURNEY_TYPE.DEATHMATCH, argv.opponent, argv.hero)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Deathmatch
	.command('cross', 'Fight in XServer tourney', (yargs) => {
		return yargs.option('opponent', {
			description: 'ID of the opponent to challenge',
			alias: 'o',
			type: 'string',
			default: null,
		}).option('hero', {
			description: 'ID of the hero that will challenge',
			alias: 'h',
			type: 'number',
			default: null,
		})
	}, async (argv) => {
		login(argv.account, argv.server)

		await doTourney(TOURNEY_TYPE.XSERVER, argv.opponent, argv.hero)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})

	//Visit maidens
	.command('visits', 'Visit maidens', (yargs) => {
		return yargs.option('amount', {
			description: 'Number of visits to do',
			alias: 'n',
			type: 'number',
		}).option('draughts', {
			description: 'Number of draughts to use',
			alias: 'd',
			type: 'number',
		})
	}, async (argv) => {
		login(argv.account, argv.server)

		await visitMaidens(argv.amount, argv.draughts)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})

	//Processions
	.command('processions', 'Do processions', (yargs) => {
		return yargs.option('amount', {
			description: 'Number of processions to do',
			alias: 'n',
			type: 'number',
		}).option('draughts', {
			description: 'Number of draughts to use',
			alias: 'd',
			type: 'number',
		})
	}, async (argv) => {
		login(argv.account, argv.server)

		await doProcessions(argv.amount, argv.draughts)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})

	//Gems
	.command('gems', 'Explore the kingdom', (yargs) => {
		return yargs.option('amount', {
			description: 'Number of gems to get',
			alias: 'n',
			type: 'number',
		})
	}, async (argv) => {
		if (argv.account && argv.server) {
			login(argv.account, argv.server)
		} else {
			goat._setAccount(ACCOUNT_GAUTIER)
		}

		await getGems(argv.amount)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	.argv

