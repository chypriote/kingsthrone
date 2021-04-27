module.exports = ({ env }) => ({
	host: env('HOST', '0.0.0.0'),
	port: env.int('PORT', 1337),
	url: env('URL', ''),
	cron: {
		enabled: true,
	},
	admin: {
		auth: {
			secret: env('ADMIN_JWT_SECRET', '8b8181dab43540e7262d42bc374ebe45'),
		},
	},
})
