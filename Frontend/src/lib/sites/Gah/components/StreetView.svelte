<script lang="ts">
	import Pano from '$lib/components/Pano.svelte';

	import { api } from '$lib/js/api';
	import { VotingPhase } from '$lib/js/GeoBingoAgainstHumanity';
	export let pano: any;
	export let reported: boolean;

	let googleMapsApiKey = import.meta.env.VITE_GMAPSAPI;
	$: votingPhase =
		$api.game.currentPhase instanceof VotingPhase
			? $api.game.currentPhase
			: undefined;
	let ignoreReported: Array<String> = [];
	let random = Math.random();
</script>

<div class="relative w-full h-full">
	{#if pano}
		{#if !reported || ignoreReported.includes(pano.pano)}
			<iframe
				title="google maps"
				id={pano.pano + random}
				frameborder="8"
				style=""
				height="100%"
				width="100%"
				src={`https://www.google.com/maps/embed/v1/streetview?pano=${
					pano.pano
				}&heading=${pano.pov.heading <= 360 ? pano.pov.heading : 360}&pitch=${
					pano.pov.pitch <= 90 ? pano.pov.pitch : 90
				}&fov=${
					180 / Math.pow(2, pano.pov.zoom) <= 100
						? 180 / Math.pow(2, pano.pov.zoom)
						: 100
				}&key=${googleMapsApiKey}`}
				allowfullscreen />

			<button
				class="absolute  btn-xs bottom-5 left-5 btn btn-info"
				on:click={() => {
					document.getElementById(pano.pano + random).src =
						document.getElementById(pano.pano + random).src;
				}}>reload</button>

			{#if api.player.twitch}
				<div
					class="absolute flex justify-center w-full pointer-events-none items-center top-2">
					<button
						on:click={() => {
							votingPhase.reportAsNSFW(pano.pano, 'gah report', api.player.id);
						}}
						class="pointer-events-auto btn btn-xs btn-error">report</button>
				</div>
			{/if}
		{:else}
			<div
				class="p-2 w-full h-full flex justify-center items-center  bg-red-500">
				<div class="flex flex">
					warning this photosphere was reported
					<button
						on:click={() => {
							ignoreReported.push(pano.pano);
							ignoreReported = ignoreReported;
						}}
						class="btn">show anyway</button>
				</div>
			</div>
		{/if}
	{:else}
		<div
			class="w-full h-48 h-full text-center items-center flex justify-center ">
			no image
		</div>
	{/if}
</div>
