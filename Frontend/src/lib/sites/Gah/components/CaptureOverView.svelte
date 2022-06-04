<script lang="ts">
	export let captures = [];
	export let text = '';

	const getWhichPicture = (index: number) => {
		let i = 0;
		for (const c of ingame.card.text.slice(0, index)) {
			if (c === '_') {
				i++;
			}
		}
		return i;
	};
</script>

<div class="grid">
	{#each text as c, i}
		{#if c === '_'}
			<!-- missing photo symbol or streetview -->
		{:else}
			{c}
		{/if}
	{/each}
</div>
