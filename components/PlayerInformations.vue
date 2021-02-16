<template>
	<div>
		<h1>{{ player.name }}</h1>
		<p>{{ `VIP${player.vip} - Level ${rank.level}` }}</p>

		<div class="columns">
			<aside class="column power">
				<h2>Power</h2>
				<p>{{ rank.power }}</p>
				<p>{{ rank.rank }}</p>
			</aside>
			<aside class="column alliance">
				<h2>Alliance</h2>
				<p>{{ alliance.name }}</p>
			</aside>
		</div>
		<blockquote>
			{{ player }}
		</blockquote>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
	name: 'PlayerInformations',
	computed: {
		...mapState(['player']),
		alliance () { return this.player.alliance },
		rank () { return this.player.rank },
	},
})
</script>
