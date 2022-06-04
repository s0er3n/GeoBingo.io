<script>
	import StreetView from './StreetView.svelte';
	export let capture;
	export let phase;

	const getWhichPicture = (index) => {
		let i = 0;
		for (const c of phase.card.text.slice(0, index)) {
			if (c === '_') {
				i++;
			}
		}
		return i;
	};
</script>

<div
	class="bg-base-100 rounded-md shadow-md p-5 grid md:grid-cols-2 w-full h-full text-3xl text-center justify-center items-center">
	{#each phase.card.text as c, i}{#if c === '_'}
			<div class="h-full w-full p-5">
				<StreetView
					reported={capture?.captures[getWhichPicture(i)]?.nsfw}
					pano={capture?.captures[getWhichPicture(i)]?.pano.pano} />
			</div>
		{:else}
			{c}
		{/if}
	{/each}
</div>
