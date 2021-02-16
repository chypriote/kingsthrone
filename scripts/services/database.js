require('dotenv').config()
const knex = require('knex')
const client = knex({
	client: 'postgresql',
	connection: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT),
		database: process.env.DATABASE_NAME,
		user: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		ssl: { rejectUnauthorized: false },
	},
})

module.exports = client
