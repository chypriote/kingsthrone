<template>
	<tr>
		<td>{{ index + 1 }}</td>
		<td class="player">
			<nuxt-link :key="rank.player.id" :to="{name: 'index-id', params: {id: rank.player.id}}">
			{{ rank.player.name }}
			</nuxt-link>
		</td>
		<td class="vip">VIP<span style="font-weight: bold;">{{ rank.player.vip }}</span></td>
		<td v-if="rank.alliance" class="alliance">{{ rank.alliance.name }}</td>
		<td v-else>-</td>
		<td>{{ `${rank.power} (${rank.level})` }}</td>
	</tr>
</template>

<script lang="ts">
import Vue from 'vue'
import { Ranking } from '~/types/types'

export default Vue.extend({
	name: 'RankingRow',
	props: {
		index: {
			type: Number,
			required: true,
		},
		rank: {
			type: Object as () => Ranking,
			required: true,
		},
	},
})
</script>

<style scoped>
table td {
	text-align: left;
}
</style>
