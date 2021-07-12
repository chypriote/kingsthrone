#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-empty-function */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { dailyChores } from './scripts/daily'
import { doKingdom } from './scripts/kingdom'
import { doTourney } from './scripts/tourney'
import { doProcessions, visitMaidens } from './scripts/actions'
import { goat, LOGIN_ACCOUNT_GAUTIER } from './scripts/services/requests'

yargs(hideBin(process.argv))
	.option('account', {
		description: 'account used',
		default: 'demophlos',
		alias: 'a',
		type: 'string',
	})
	.command('full', 'Runs daily chores, kingdom and tourney', () => {}, async (argv) => {
		await dailyChores(argv.account)
		await doKingdom(argv.account)
		await doTourney(argv.account)
		process.exit()
	})
	.command('daily', 'Run daily chores', () => {}, async (argv) => {
		await dailyChores(argv.account)
		process.exit()
	})
	.command('kingdom', 'Explore the kingdom', () => {}, async (argv) => {
		await doKingdom(argv.account)
		process.exit()
	})
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
		await doTourney(argv.account, argv.opponent, argv.hero)
		process.exit()
	})
	.command('visit', 'Visit maidens', (yargs) => {
		return yargs.option('amount', {
			description: 'Number of visits to do',
			alias: 'n',
			type: 'number',
		})
	}, async (argv) => {
		if (argv.account === 'gautier') { await goat.login(LOGIN_ACCOUNT_GAUTIER) }
		await visitMaidens(argv.amount)
		process.exit()
	})
	.command('processions', 'Do processions', (yargs) => {
		return yargs.option('amount', {
			description: 'Number of processions to do',
			alias: 'n',
			type: 'number',
		})
	}, async (argv) => {
		if (argv.account === 'gautier') { await goat.login(LOGIN_ACCOUNT_GAUTIER) }
		await doProcessions(argv.amount)
		process.exit()
	})
	.argv

