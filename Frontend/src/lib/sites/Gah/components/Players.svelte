<script lang="ts">
	import { api } from '$lib/js/api';
	import { Lobby } from '$lib/js/GeoBingoAgainstHumanity';
	import Profile from '$lib/components/Profile.svelte';

	$: lobby =
		$api.game.currentPhase instanceof Lobby
			? $api.game.currentPhase
			: undefined;

	function getOverallScore(player): number {
		if (!player || !lobby.overallScore) return 0;
		const [_, score] = lobby.overallScore.find(
			(el) => el[0].id === player.id
		) ?? [0, 0];
		return score;
	}
</script>

<div class="px-5 bg-base-100 shadow-xl shadow-md rounded-md h-fit">
	<ul>
		{#each lobby.players.sort((a, b) => getOverallScore(b) - getOverallScore(a)) ?? [] as player}
			<li class="">
				<div class="p-2 flex ">
					<!-- <div -->
					<!-- 	class="text-center flex justify-center items-center w-6 font-bold text-xl"> -->
					<!-- 	<!-- {api.game.currentPhase.score[player.id]?.points ?? 0} -->
					<!-- </div> -->
					<div class="flex text-center items-center pr-2">
						{getOverallScore(player)}
					</div>
					<Profile {player} />
				</div>
			</li>
		{/each}
	</ul>
</div>
