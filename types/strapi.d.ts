import { NuxtHTTPInstance } from '@nuxt/http'
import { NuxtCookies } from 'cookie-universal-nuxt'

export interface ModuleConfiguration {
	url?: string
	entities?: Array<string>
}

export interface StrapiInstance {
	register (data: { email: string, username: string, password: string }): Promise<{ user: any, jwt: string }>
	login (data: { identifier: string, password: string }): Promise<void>
	logout (): void
	forgotPassword (data: { email: string }): Promise<void>
	resetPassword (data: { code: string, password: string, passwordConfirmation: string }): Promise<{ user: any, jwt: string }>
	sendEmailConfirmation (data: { email: string }): Promise<void>

	fetchUser (): Promise<any>
	setUser (user: any): void

	find (entity: string, searchParams?: SearchParameters): Promise<Array<any>>
	count (entity: string, searchParams?: SearchParameters): Promise<number>
	findOne (entity: string, id: number): Promise<any>
	create (entity: string, data: any): Promise<any>
	update (entity: string, id: number, data: any): Promise<any>
	delete (entity: string, id: number): Promise<void>

	getToken (): string
	setToken (jwt: string): void
	clearToken (): void

	$http: NuxtHTTPInstance
	$cookies: NuxtCookies
}

export interface SearchParameters {

}

declare module 'vue/types/vue' {
	interface Vue {
		readonly $strapi: StrapiInstance
	}
}

declare module '@nuxt/types' {
	interface Context {
		readonly $strapi: StrapiInstance
	}

	interface NuxtAppOptions {
		readonly $strapi: StrapiInstance
	}

	interface NuxtOptions {
		strapi?: ModuleConfiguration
	}
}

declare module '@nuxt/vue-app' {
	interface Context {
		$strapi: StrapiInstance
	}
}

declare module 'vuex/types' {
	interface Store<S> {
		readonly $strapi: StrapiInstance
	}
}
