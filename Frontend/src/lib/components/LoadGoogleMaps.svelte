<script context="module">
	let resolver;
	let loaded = new Promise((resolve) => (resolver = resolve));
	export const loadGoogleMaps = writable(loaded);
	export const load = writable(false);
</script>

<script>
	import { dev } from '$app/environment';
	import { writable } from 'svelte/store';
	let googleMapsApiKey = import.meta.env.VITE_GMAPSAPI;

	// not working
	window.initMap = function () {
		load.set(true);
		resolver();
	};
</script>

<svelte:head>
	{#if !$load}
		<script
			async
			src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&language=en&callback=initMap`}>
		</script>
	{/if}
</svelte:head>
