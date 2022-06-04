<script>
	import { api } from '$lib/js/api';
	$: isHost = $api.isHost;
</script>

<div class="label uppercase pt-4">{$api.game.currentPhase.time} min</div>
<input
	disabled={!isHost}
	type="range"
	max="60"
	min="1"
	on:input={(e) => {
		api.game.settings.changeTime(e.target.value);
	}}
	bind:value={$api.game.currentPhase.time}
	class="range range-primary" />
