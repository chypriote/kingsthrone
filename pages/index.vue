<template>
	<div class="columns">
		<div class="column">
			<ranking-table />
		</div>
		<div class="column">
			<nuxt-child />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import RankingTable from '~/components/RankingTable.vue'

export default Vue.extend({
	components: { RankingTable },
	async asyncData ({ store }): Promise<void> {
		await store.dispatch('FETCH_RANKINGS')
	},
})
</script>
