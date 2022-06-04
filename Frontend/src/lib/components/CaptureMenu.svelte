<script>
	import { XIcon, ChevronLeftIcon } from 'svelte-feather-icons';
	import { map } from '$lib/components/Map.svelte';
	import { api } from '$lib/js/api';

	import { swipe } from 'svelte-gestures';

	const makePhoto = (i) => {
		let streetview = $map.map.getStreetView();
		try {
			let pano = { pano: streetview.pano, pov: streetview.pov };
			let position = {
				lat: streetview.position.lat(),
				long: streetview.position.lng()
			};

			if (streetview.pano === undefined) {
				throw 'no pano';
			}
			$api.game.currentPhase.addCapture(i, { pano, position });
		} catch (e) {
			alert('You can only take photos in Streetview');
			console.log(e);
		}
	};
	let hide = false;

	let taken = [];
	function photoTaken() {
		let takenLocale = [];
		if (!$api.game) {
			return;
		}
		if ($api.game.currentPhase.captures) {
			$api.game.currentPhase.captures
				.filter((capture) => capture.player.id === $api.player.id)
				.forEach((capture) => takenLocale.push(capture.word));
		}
		taken = takenLocale;
	}

	$: $api.game ? $api.game.currentPhase.captures : '', photoTaken();
	let switchControls = localStorage.getItem('switch');
	let endGameModal = false;
	let leaveGameModal = false;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class={`modal ${endGameModal ? 'modal-open' : ''}  cursor-pointer`}>
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">Do you want to end the game?</h3>
		<div class=" flex mt-2 justify-end space-x-2">
			<button
				class="btn btn-primary"
				on:click={() => {
					endGameModal = false;
				}}>
				keep playing
			</button>
			<button
				class="btn btn-secondary"
				on:click={() => {
					api.game.currentPhase.endGame();
					endGameModal = false;
				}}>
				end the game
			</button>
		</div>
	</label>
</label>
<!-- svelte-ignore a11y-label-has-associated-control -->
<label class={`modal ${leaveGameModal ? 'modal-open' : ''}  cursor-pointer`}>
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">Do you want to end the game?</h3>
		<div class=" flex mt-2 justify-end space-x-2">
			<button
				class="btn btn-primary"
				on:click={() => {
					leaveGameModal = false;
				}}>
				keep playing
			</button>
			<button
				class="btn btn-secondary"
				on:click={() => {
					api.player.leave();
					leaveGameModal = false;
				}}>
				leave the game
			</button>
		</div>
	</label>
</label>
{#if $api.game}
	<div
		class={`h-full pointer-events-none p-2 z-10 absolute flex items-center ${
			switchControls ? 'right-0' : ''
		}`}>
		<div class="flex flex-row">
			{#if !hide}
				<ul
					class="pointer-events-auto max-w-xs menu menu-compact bg-base-100 shadow-xl rounded-l-sm ">
					<li class="p-2 menu-title uppercase">Words</li>
					<ul class="overflow-auto max-h-96">
						{#if $api.game.currentPhase.words}
							{#each $api.game.currentPhase.words as word, i}
								<li
									use:swipe={{ timeframe: 400, minSwipeDistance: 10 }}
									on:swipe={(event) => {
										console.log(event.detail.direction);
										hide = true;
									}}
									class="">
									<!-- svelte-ignore a11y-missing-attribute -->
									<a
										class={`uppercase  ${taken.includes(i) ? 'bg-accent' : ''}`}
										on:click={() => makePhoto(i)}>
										<!-- svelte-ignore a11y-label-has-associated-control -->
										<label class="swap ">
											<svg
												class={`${
													taken.includes(i) ? 'swap-on' : 'swap-off'
												} h-5 w-5 fill-current`}
												fill="none"
												viewBox="0 0 24 24">
												<path d="M0 0h24v24H0V0z" fill="none" /><path
													d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
											</svg>
											<svg
												class={`${
													!taken.includes(i) ? 'swap-on' : 'swap-off'
												} h-5 w-5 fill-current`}
												fill="none"
												viewBox="0 0 24 24"
												><path d="M0 0h24v24H0V0z" fill="none" /><path
													d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg>
										</label>
										{word.word}
									</a>
								</li>
							{/each}
						{/if}
					</ul>
					<div class="divider" />

					{#if $api.isHost}
						<li class="uppercase ">
							<a class="" on:click={() => (endGameModal = true)}
								><XIcon size="1x" />end game</a>
						</li>
					{/if}
					<li class="uppercase">
						<a class="" on:click={() => (leaveGameModal = true)}
							><ChevronLeftIcon size="1x" /> leave game</a>
					</li>
				</ul>
			{/if}
			<div
				on:click={() => (hide = !hide)}
				class="m-0 p-0 min-h-fit pointer-events-auto bg-base-100 grid content-center rounded-r-sm">
				{#if hide}
					<div class="w-18 p-2 bg-base-100 rounded-sm drop-shadow-xl ">
						WORDS
					</div>
				{:else}
					<div class="rotate-90 m-0 p-0">hide</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
