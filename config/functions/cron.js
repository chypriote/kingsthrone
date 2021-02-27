'use strict'

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#cron-tasks
 */

module.exports = {
	'5 1 * * *': {
		task: async () => {
			const { goat, update } = strapi.services

			await goat.login()
			await Promise.all([
				update.kingdom(),
				update.tourney(),
				update.alliances(),
			])
			await update.profiles()
		},
		options: {
			tz: 'Europe/Paris',
		},
	},
}
