<script>
	import { supabase } from '$lib/js/supabaseClient';
	import { api } from '$lib/js/api';
	export let image;
	export let text =
		'Bring your own door handle to every GeoBingo game to make sure to get in. Buying this will support GroGriff and GeoBingo.io. 70% of the revenue will go to GroGriff and 30% to GeoBingo.io';
	export let price;
	export let inInventory;
	export let i;
	async function equip() {
		const { data, error } = await supabase
			.from('equiped')
			.update({ equiped: i })
			.eq('user_id', $api.player.id);
		console.log(data, error);
	}
</script>

<div class="card w-96 m-2 h-fit bg-base-100 shadow-xl">
	<figure><img class="m-4 h-24 w-24" src={image} alt="Shoes" /></figure>
	<div class="card-body">
		<h2 class="card-title">Let me in please!</h2>
		<p class="text-xs">{text}</p>
		<div class="card-actions justify-end">
			{#if price}
				<button class="btn btn-primary">Buy Now for 69.69€</button>
			{/if}
			{#if inInventory}
				<button on:click={equip} class="btn btn-primary">Equip</button>
			{/if}
		</div>
	</div>
</div>
