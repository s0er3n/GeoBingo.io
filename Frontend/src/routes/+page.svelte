<script>
	import { dev, browser } from '$app/environment';
	import Footer from '$lib/components/Footer.svelte';
	import { api } from '$lib/js/api';
	import GameOver from '$lib/sites/GameOver.svelte';
	import InGame from '$lib/sites/InGame.svelte';
	import Lobby from '$lib/sites/Lobby.svelte';
	import GAHLobby from '$lib/sites/Gah/GAHLobby.svelte';
	import Main from '$lib/sites/Main.svelte';
	import Score from '$lib/sites/Score.svelte';
	import GAHIngame from '$lib/sites/Gah/GAHIngame.svelte';
	import GAHVoting from '$lib/sites/Gah/GAHVoting.svelte';
	import GahScore from '$lib/sites/Gah/GAHScore.svelte';
	import MMLobby from '$lib/sites/MMGame/MMLobby.svelte';
	import StayOrLeaveLobbyPrompt from '$lib/components/StayOrLeaveLobbyPrompt.svelte';
	if (!dev) {
		console.log = () => {};
	}
</script>

<!-- {#if $api?.game?.currentPhaseString !== 'ingame'}
	<div class="fixed -z-40 w-full h-full border-black border-[0px]">
		<video
			autoplay
			muted
			loop
			playsinline
			class="-z-50  w-full h-full  blur-md object-cover fit  ">
			<source src="/Untitled.mp4" type="video/mp4" />
		</video>
	</div>
{/if} -->
{#if !$api.game}
	<Main />
	<Footer />
{:else if $api.game.gameMode === 'NormalGame'}
	<StayOrLeaveLobbyPrompt />
	{#if $api.game.currentPhaseString === 'lobby'}
		<Lobby />
	{:else if $api.game.currentPhaseString === 'ingame'}
		<InGame />
	{:else if $api.game.currentPhaseString === 'votingphase'}
		<GameOver />
	{:else if $api.game.currentPhaseString === 'score'}
		<Score />
	{/if}
{:else if $api.game.gameMode === 'MMGame'}
	{#if $api.game.currentPhaseString === 'lobby'}
		<MMLobby />
		<!-- <Lobby /> -->
	{:else if $api.game.currentPhaseString === 'ingame'}
		<InGame />
	{:else if $api.game.currentPhaseString === 'votingphase'}
		<GameOver />
	{:else if $api.game.currentPhaseString === 'score'}
		<Score />
	{/if}
{:else if $api.game.gameMode === 'gah'}
	<StayOrLeaveLobbyPrompt />
	{#if $api.game.currentPhaseString === 'lobby'}
		<GAHLobby />
	{:else if $api.game.currentPhaseString === 'ingame'}
		<GAHIngame />
	{:else if $api.game.currentPhaseString === 'votingphase'}
		<GAHVoting />
	{:else if $api.game.currentPhaseString === 'score'}
		<GahScore />
	{/if}
{:else}
	error
{/if}
