/* eslint-disable */
//@ts-nocheck
import chalk = require('chalk')

export const logger = {
	log: (...message) => {
		console.log(...message)
	},
	debug: (...message) => {
		if (process.env.NODE_ENV !== 'development' || false) return
		console.log(chalk.grey(...message))
	},
	warn: (...message) => {
		console.log(chalk.yellow(...message))
	},
	alert: (...message) => {
		console.log(chalk.magenta(...message))
	},
	error: (...message) => {
		console.log(chalk.red(...message))
		console.trace()
	},
	success: (...message) => {
		console.log(chalk.green(...message))
	},
}
