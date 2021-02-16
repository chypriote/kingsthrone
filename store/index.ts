import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { Player, Ranking } from '~/types/types'

interface IState {
	player: Player | null
	rankings: Ranking[]
}

export const state = (): IState => ({
	rankings: [],
	player: null,
})

export const getters: GetterTree<IState, IState> = {
}

export const mutations: MutationTree<IState> = {
	SET_RANKINGS (state: IState, rankings: Ranking[]) {
		state.rankings = rankings
	},
	SET_PLAYER (state: IState, player: Player|null) {
		state.player = player
	}
}

export const actions: ActionTree<IState, IState> = {
	async FETCH_RANKINGS ({ commit }) {
		try {
			commit('SET_RANKINGS', await this.$strapi.find('rankings/ladder'))
		} catch (e) {console.log(e)}
	},

	async FETCH_PLAYER ({ commit }, id) {
		try {
			commit('SET_PLAYER', await this.$strapi.$http.get(`players/informations/${id}`).then(response => response.json()))
		} catch (e) {console.log(e)}
	},

	async nuxtServerInit ({ dispatch }) {
		await Promise.all([
			dispatch('FETCH_RANKINGS'),
		])
	},
}
