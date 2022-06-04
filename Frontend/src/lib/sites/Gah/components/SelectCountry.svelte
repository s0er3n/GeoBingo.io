<script lang="ts">
	import { api } from '$lib/js/api';
	let countries = $api.geometries;
	$: isHost = $api.isHost;
</script>

<div class="label uppercase pt-4">country</div>
<div class="flex ">
	<div class="w-full">
		<select
			disabled={!isHost}
			on:change={(e) => api.game.settings.changeCountry(e.target.value)}
			class="w-full select select-bordered select ">
			<option value={'all'} selected={'all' === $api.game.currentPhase.country}
				>{'all'}</option>
			{#each countries as country}
				<option
					value={country}
					selected={country == $api.game.currentPhase.country}
					>{country}</option>
			{/each}
		</select>
	</div>
</div>
