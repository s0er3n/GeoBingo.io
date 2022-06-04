<script lang="ts">
	import { api } from '$lib/js/api';
	import { Lobby } from '$lib/js/GeoBingoAgainstHumanity';
	import Link from './Link.svelte';
	import TimeSlider from './TimeSlider.svelte';
	import SizeSlider from './SizeSlider.svelte';
	// import SelectCountry from './SelectCountry.svelte';

	import OnlyAllowTwitchPlayers from './OnlyAllowTwitchPlayers.svelte';
	import ThemePicker from '$lib/components/ThemePicker.svelte';
	import ChangeGameMode from '$lib/components/ChangeGameMode.svelte';

	$: lobby =
		$api.game.currentPhase instanceof Lobby
			? $api.game.currentPhase
			: undefined;
</script>

<div class="p-5 bg-base-100 shadow-xl  shadow-md rounded-md h-fit">
	<button
		disabled={!$api.isHost}
		class="btn btn-primary w-full"
		on:click={lobby?.startGame}>start game</button>
	<Link />
	<TimeSlider />
	<SizeSlider />
	<!-- not implemented yet -->
	<!-- <SelectCountry /> -->
	<div class="w-full pt-2">
		<span class="">THEME</span>

		<div class="py-1" />
		<ThemePicker />
	</div>
	<OnlyAllowTwitchPlayers />
	<ChangeGameMode gameMode={'game'} />
</div>
