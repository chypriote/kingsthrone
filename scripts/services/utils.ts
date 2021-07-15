
export const utils = {
	/**
	 * Allow for special capitalization cases (such as OAuth)
	 */
	pascalToCamelCase: (name: string): string => {
		if (name === 'OAuth') {
			return 'oauth'
		} else {
			return name[0].toLowerCase() + name.substring(1)
		}
	},
}
