<script>
	import { api } from '$lib/js/api';
	import Item from '$lib/Item.svelte';
</script>

{#if $api?.player?.auth?.emotes}
	{#each $api.player.auth.emotes as emote, i}
		<Item image={emote} inInventory={true} {i} />
	{/each}
{/if}
