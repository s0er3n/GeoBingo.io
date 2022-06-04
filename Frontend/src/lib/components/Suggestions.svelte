<script>
	import { api } from '$lib/js/api';
	$: isHost = $api.isHost;
	let disable = false;
</script>

<div class="card-title my-5">
	Suggestions <input
		on:click={() => (disable = !disable)}
		checked={!disable}
		type="checkbox"
		class="toggle" />
	{#if isHost}
		<button
			on:click={() => api.game.currentPhase.clearSuggestions()}
			class="btn btn-primary btn-sm">clear all suggestions</button>
	{/if}
</div>
{#if !disable}
	{#if $api.game.currentPhase?.host?.twitch}
		write !suggest {'{word'}} in twitch chat of {$api.game.currentPhase.host
			.name}
		to make suggestions
	{/if}

	{#each $api.game.currentPhase?.suggestedWords ?? [] as suggestedWord}
		<li class="mb-5 mt-5">
			<label class="label">
				<span class="label-text-alt">{suggestedWord.playerName}</span>
			</label>
			<div class="grid grid-cols-2 gap-5 md:flex w-full">
				<input
					type="text"
					disabled={true}
					placeholder="Word"
					class="input uppercase col-span-2 input-primary rounded input-bordered w-full"
					value={suggestedWord.word} />

				{#if isHost}
					<button
						class=" btn btn-secondary"
						on:click={() =>
							api.game.currentPhase.addWordSuggestionToWords(
								suggestedWord.word
							)}>add</button>
					<button
						class=" btn btn-warning"
						on:click={() =>
							api.game.currentPhase.removeWordSuggestion(suggestedWord.word)}
						>delete</button>
				{/if}
			</div>
		</li>
	{/each}
{/if}
