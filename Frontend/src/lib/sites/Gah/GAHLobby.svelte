<script lang="ts">
	import Card from './components/Card.svelte';
	import GameSettings from './components/GameSettings.svelte';
	import Players from './components/Players.svelte';
	import Head from '$lib/components/Head.svelte';
	import Socials from '$lib/components/Socials.svelte';
</script>

<div class="px-2 h-w-ful w-full">
	<div class="">
		<Head />
	</div>
	<Socials />
	<Card />
	<div class="pt-5 w-full flex flex-wrap justify-around">
		<div class="p-2">
			<Players />
		</div>
		<div class="p-2">
			<GameSettings />
		</div>
	</div>
</div>
