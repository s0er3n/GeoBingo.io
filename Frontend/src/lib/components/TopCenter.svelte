<script>
	import { onDestroy } from 'svelte';
	import { api } from '$lib/js/api';
	import { Ingame } from '$lib/js/NormalGame';

	let min = 0;
	let seconds = 0;
	let timeLeft = 1;
	let timeNow = new Date() - api.timeDelta;

	let endTime = Date.parse($api.game.currentPhase.gameEndTime);

	let timer = setInterval(function () {
		let timeNow = new Date();
		timeLeft = parseInt(parseInt(endTime - (timeNow - api.timeDelta)) / 1000);
		seconds = timeLeft % 60;
		min = Math.floor(timeLeft / 60);
	}, 1000);
	$: {
		if ($api.game.currentPhaseString !== 'ingame') {
			clearInterval(timer);
		}
	}
	onDestroy(() => {
		clearInterval(timer);
	});
</script>

{#if $api.game}
	<div class="pointer-events-none absolute flex justify-center w-screen z-10">
		<div
			class="  rounded-sm  bg-base-100 text-xl m-2 shadow-2xl text-center p-1">
			<span class="p-2 text-center  countdown">
				<span style={`--value:${min};`} />m

				<span style={`--value:${seconds};`} />s
			</span>
			{#if $api.game.currentPhase.country !== 'all'}
				<div class="">
					{$api.game.currentPhase.country}
				</div>
			{/if}
		</div>
	</div>
{/if}
