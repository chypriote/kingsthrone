<template>
	<table class="table">
		<thead>
			<tr>
				<th>Rank</th>
				<th>Name</th>
				<th>VIP</th>
				<th>Alliance</th>
				<th>Power</th>
			</tr>
		</thead>
		<tbody>
			<ranking-row v-for="(rank, index) of rankings" :key="rank.id" :rank="rank" :index="index" />
		</tbody>
	</table>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import RankingRow from '~/components/RankingRow.vue'

export default Vue.extend({
	name: 'RankingTable',
	components: { RankingRow },
	computed: {
		...mapState(['rankings']),
	},
})
</script>
