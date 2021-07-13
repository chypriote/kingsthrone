#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-empty-function */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { dailyChores } from './scripts/daily'
import { doKingdom } from './scripts/kingdom'
import { doTourney } from './scripts/tourney'
import { doProcessions, visitMaidens } from './scripts/actions'
import { goat, LOGIN_ACCOUNT_GAUTIER, LOGIN_ACCOUNT_NAPOLEON } from './scripts/services/requests'
import { getGems } from './scripts/actions/gems'

yargs(hideBin(process.argv))
	.option('account', {
		description: 'account used',
		default: 'demophlos',
		alias: 'a',
		type: 'string',
	})
	.command('full', 'Runs daily chores, kingdom and tourney', () => {}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await dailyChores()
		await doKingdom()
		await doTourney()
		process.exit()
	})
	//Daily
	.command('daily', 'Run daily chores', () => {}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await dailyChores()
		process.exit()
	})
	//Kingdom
	.command('kingdom', 'Explore the kingdom', () => {}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await doKingdom()
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

		await doTourney(argv.opponent, argv.hero)
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
		process.exit()
	})
	//Processions
	.command('processions', 'Do processions', (yargs) => {
		return yargs.option('amount', {
			description: 'Number of processions to do',
			alias: 'n',
			type: 'number',
		})
	}, async (argv) => {
		await goat.login(argv.account === 'gautier' ? LOGIN_ACCOUNT_GAUTIER : LOGIN_ACCOUNT_NAPOLEON)

		await doProcessions(argv.amount)
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
		process.exit()
	})
	.argv

