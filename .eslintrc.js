module.exports = {
	root: true,
	env: {
		commonjs: true,
		es6: true,
		node: true,
		browser: false,
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: false,
		},
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'prettier',
	],
	globals: {
		'strapi': true,
	},
	rules: {
		camelcase: 'off',
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'never',
				exports: 'never',
				functions: 'never',
			},
		],
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-prototype-builtins': 'off',
		'no-return-assign': 'error',
		'no-tab': 'off',
		'no-tabs': 'off',
		'number-leading-zero': 'off',
		'object-curly-spacing': ['error', 'always'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
	},
}