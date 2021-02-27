'use strict'
const chalk = require('chalk')

module.exports = {
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
	error: (...message) => {
		console.log(chalk.red(...message))
	},
	success: (...message) => {
		console.log(chalk.green(...message))
	},
}
