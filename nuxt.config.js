export default {
	target: 'static',
	head: {
		title: 'thronesking',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	css: ['bulma/css/bulma.min.css'],
	plugins: [],
	components: false,
	telemetry: false,
	buildModules: ['@nuxt/typescript-build', '@nuxtjs/stylelint-module'],
	modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxtjs/strapi'],

	pwa: {
		manifest: {
			lang: 'en',
		},
	},
	build: {
		extend (config) {
			config.resolve.alias.vue = 'vue/dist/vue.esm.js'
		},
		transpile: ['lodash-es'],
		postcss: {
			parser: require('postcss-comment'),
			plugins: {
				'postcss-nested': {},
				'postcss-custom-properties': {},
				'postcss-color-mod-function': {},
			},
		},
	},
}
