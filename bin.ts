#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-empty-function */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { dailyChores } from './scripts/daily'
import { doKingdom } from './scripts/actions/kingdom'
import { doTourney } from './scripts/tourney'
import { doProcessions, visitMaidens } from './scripts/actions'
import { goat, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './scripts/services/requests'
import { getGems } from './scripts/actions/gems'
import { TOURNEY_TYPE } from './scripts/tourney/fight'
import { logger } from './scripts/services/logger'
import { format } from 'date-fns'

yargs(hideBin(process.argv))
	.option('account', {
		description: 'account used',
		default: 'demophlos',
		alias: 'a',
		type: 'string',
	})
	.command('full', 'Runs daily chores, kingdom and tourney', () => {}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await doKingdom()
		await doTourney(TOURNEY_TYPE.LOCAL)
		await dailyChores()
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Daily
	.command('daily', 'Run daily chores', () => {}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await dailyChores()
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	//Kingdom
	.command('kingdom', 'Explore the kingdom', () => {}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await doKingdom()
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
		})
	}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

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
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

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
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

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
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

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
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

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
		await goat.login(LOGIN_ACCOUNT_GAUTIER)

		await getGems(argv.amount)
		logger.success(`Finished ${format(new Date(), 'HH:mm')}`)
		process.exit()
	})
	.argv

