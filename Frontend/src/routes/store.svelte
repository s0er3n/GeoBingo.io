<script>
	import Item from '$lib/Item.svelte';
</script>

<div class="w-screen h-full">
	<div class="flex w-full items-center justify-center btn-group  m-2">
		<button class="btn btn-active">Store</button>
		<button class="btn">inventory</button>
	</div>

	<div class="flex flex-wrap  ">
		<Item />
		<Item />
		<Item />
		<Item />
		<Item />
	</div>
</div>
