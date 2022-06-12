<script lang="ts">
	import Profile from '$lib/components/Profile.svelte';
	import Socials from '$lib/components/Socials.svelte';
	import Suggestions from '$lib/components/Suggestions.svelte';
	import ThemePicker from '$lib/components/ThemePicker.svelte';
	import { Lobby as L } from '$lib/js/NormalGame';

	import { Lobby as M } from '$lib/js/MMGame';
	import {
		LockIcon,
		UnlockIcon,
		ShuffleIcon,
		TrashIcon,
		CopyIcon,
		Share2Icon,
		AlertTriangleIcon
	} from 'svelte-feather-icons';
	import { onDestroy } from 'svelte';
	// import Inventory from '$lib/components/Inventory.svelte';
	// import svelteParticles from 'svelte-particles';
	import Head from '$lib/components/Head.svelte';
	import { api } from '$lib/js/api';
	import ChangeGameMode from '$lib/components/ChangeGameMode.svelte';

	// magic line for type things
	$: lobby =
		$api.game.currentPhase instanceof L || $api.game.currentPhase instanceof M
			? $api.game.currentPhase
			: undefined;

	// const lang = navigator.language || navigator.userLanguage;
	const lang = 'en';

	let countries = $api.geometries;
	let lockedWords = [];
	let countryEnabled = true;
	let toggleDatabase = false;
	let customWord = '';
	let suggestedWord = '';

	function randomCountry() {
		return countries[Math.floor(Math.random() * countries.length)];
	}

	function handleCustomWord() {
		lobby.addCustomWord(customWord, toggleDatabase);
		customWord = '';
	}
	function handleSuggestedWord() {
		lobby.addSuggestedWord(suggestedWord);
		suggestedWord = '';
	}

	let words = api.game.currentPhase.words;
	let typing = false;
	let oldTimeout = [];
	let unsubscribe = api.subscribe((c) => {
		if (!typing && c?.game?.currentPhase) {
			words = c.game.currentPhase.words;
		}
	});

	const makeIsLockedWordObj = () => {
		let res = {};
		for (let index = 0; index < words.length; index++) {
			res[index] = lockedWords.includes(index);
		}
		return res;
	};
	let isLockedWord = makeIsLockedWordObj();

	onDestroy(() => unsubscribe());
	$: isHost = $api.isHost;
	let addWordModal = '';
	let reportWordModal = '';
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class={`modal ${addWordModal ? 'modal-open' : ''}  cursor-pointer`}>
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">
			Do you want to add the prompt "{addWordModal}" to the database for other
			people to play?
		</h3>
		<div class=" flex mt-2 justify-end space-x-2">
			<button
				class="btn btn-primary"
				on:click={() => {
					lobby.addWordToDB(addWordModal);
					addWordModal = '';
				}}>
				Yes
			</button>
			<button
				class="btn btn-secondary"
				on:click={() => {
					addWordModal = '';
				}}>
				no
			</button>
		</div>
	</label>
</label>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class={`modal ${reportWordModal ? 'modal-open' : ''}  cursor-pointer`}>
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">
			Do you want to report the word "{reportWordModal}"?
		</h3>
		<div class=" flex mt-2 justify-end space-x-2">
			<button
				class="btn btn-primary"
				on:click={() => {
					const foundWordObject = words.find(
						(element) =>
							element.word.toLowerCase() === reportWordModal.toLowerCase()
					);
					lobby.reportWord(foundWordObject.word);
					lobby.deleteWord(words.indexOf(foundWordObject));

					reportWordModal = '';
				}}>
				Yes
			</button>
			<button
				class="btn btn-secondary"
				on:click={() => {
					reportWordModal = '';
				}}>
				no
			</button>
		</div>
	</label>
</label>
<div class="flex flex-col justify-center items-center  w-full h-full px-2">
	<div class="w-full py-2">
		<Head />
	</div>

	<div class="grid gap-5 m-0 lg:grid-cols-2 ">
		<div>
			<div class="mb-4 bg-base-100 card bordered shadow-lg">
				<div class="card-body">
					<h3 class="card-title">Links</h3>
					<div class="grid gap-2">
						<div class="flex gap-2"><Socials /></div>
						<div>please report bugs and suggestions in the discord server</div>
					</div>
				</div>
			</div>
			<div class="card bg-base-100 bordered shadow-lg">
				<div class="card-body">
					<h3 class="card-title">
						Words {words.length}
						{#if isHost}
							<button
								class=" btn btn-secondary"
								on:click={() => lobby.newRandomWords(lockedWords)}
								>randomize all words</button>
							<select
								on:change={(e) => api.game.settings.changeLang(e.target.value)}
								class="select uppercase w-full max-w-xs border-2 border-black">
								<option disabled selected>Pick your language</option>
								<option value="en">English</option>
								<option value="nl">Dutch</option>
								<option value="es">Spanish</option>
								<option value="de">German</option>
								<option value="fr">french</option>
								<option value="pt">portuguese</option>
							</select>
						{/if}
					</h3>
					<ul>
						{#each words.map((word) => {
							return { word: word.word
										.charAt(0)
										.toUpperCase() + word.word.slice(1) };
						}) as word, i}
							<li name={word.word} class="mb-5">
								<div
									class={`grid ${
										isHost ? 'grid-cols-2' : ''
									} gap-5 md:flex w-full`}>
									{#if isHost}
										<div
											class="tooltip tooltip-right"
											data-tip="lock this word">
											<button
												class="btn btn-ghost text-xl"
												on:click={() => {
													lockedWords.includes(i)
														? (lockedWords = lockedWords.filter((w) => w !== i))
														: lockedWords.push(i);
													isLockedWord = makeIsLockedWordObj();
												}}>
												{#if isLockedWord[i]}<LockIcon
														size="1x" />{:else}<UnlockIcon
														size="1x" />{/if}</button>
										</div>
									{/if}
									<input
										type="text"
										disabled={!isHost || isLockedWord[i]}
										on:keyup={(e) => {
											typing = true;
											if (oldTimeout[i]) {
												clearTimeout(oldTimeout[i]);
											}
											oldTimeout[i] = setTimeout(() => {
												typing = false;
												api.game.currentPhase.changeWord(e.target.value, i);
											}, 1000);
										}}
										placeholder="Word"
										class="input uppercase select-auto col-span-2 input-primary rounded input-bordered w-full"
										id={i}
										value={word.word} />

									{#if isHost}
										<div class="tooltip" data-tip="get a random new word">
											<button
												class=" btn btn-secondary"
												on:click={() => lobby.newRandomWord(i)}
												disabled={isLockedWord[i]}
												><ShuffleIcon size="1x" /></button>
										</div>
										{#if lang.startsWith('en')}
											<div
												class="tooltip"
												data-tip="save in database for other people">
												<button
													class=" btn btn-primary"
													on:click={() => (addWordModal = word.word)}
													disabled={isLockedWord[i]}
													><Share2Icon size="1x" /></button>
											</div>
										{/if}

										<div class="tooltip" data-tip="report this word">
											<button
												class=" btn btn-warning"
												on:click={() => {
													// client.reportWord(word.word);
													reportWordModal = word.word;
													// deleting word
													lockedWords = lockedWords.filter((w) => w !== i);
													lockedWords = lockedWords.map((w) => {
														if (w > i) {
															w = w - 1;
														}
														return w;
													});
													isLockedWord = makeIsLockedWordObj();
												}}
												disabled={isLockedWord[i]}
												><AlertTriangleIcon size="1x" /></button>
										</div>

										<div
											class="tooltip tooltip-left"
											data-tip="delete this word">
											<button
												class=" btn btn-warning"
												on:click={() => {
													lobby.deleteWord(i);
													lockedWords = lockedWords.filter((w) => w !== i);
													lockedWords = lockedWords.map((w) => {
														if (w > i) {
															w = w - 1;
														}
														return w;
													});
													isLockedWord = makeIsLockedWordObj();
												}}
												disabled={isLockedWord[i]}
												><TrashIcon size="1x" /></button>
										</div>
									{/if}
								</div>
							</li>
						{/each}
						{#if isHost}
							<li class="flex my-2 place-items-center items-center">
								<button
									class="btn btn-primary w-full"
									on:click={() => lobby.addWord()}>add word</button>
							</li>
							<li>
								<label
									for="my-modal-2"
									class="btn btn-secondary modal-button w-full">
									add custom word
								</label>
								<input type="checkbox" id="my-modal-2" class="modal-toggle" />
								<div class="modal">
									<div class="modal-box">
										<p>add a custom word (use ; for multiple words)</p>
										<div class="mt-5 form-control">
											<!-- <label class="cursor-pointer label">
													<span class="label-text"
														>save for other people to play</span>
													<input
														type="checkbox"
														bind:checked={toggleDatabase}
														class="toggle toggle-lg toggle-primary" />
												</label> -->
											<div class="relative">
												<input
													type="text"
													bind:value={customWord}
													on:keydown={(e) => {
														if (e.key === 'Enter') {
															handleCustomWord();
														}
													}}
													placeholder="custom word"
													class="w-full input select-auto input-primary input-bordered" />
												<button
													on:click={handleCustomWord}
													class="absolute top-0 right-0 rounded-l-none btn btn-primary">
													add
												</button>
											</div>
										</div>
										<div class="modal-action">
											<label for="my-modal-2" class="btn">Close</label>
										</div>
									</div>
								</div>
							</li>
						{/if}
						{#if !isHost}
							<li>
								<label
									for="my-modal-2"
									class="btn btn-secondary modal-button w-full">
									suggest a word
								</label>
								<input type="checkbox" id="my-modal-2" class="modal-toggle" />
								<div class="modal">
									<div class="modal-box">
										<p>suggest a word (use ; for multiple words)</p>
										<div class="mt-5 form-control">
											<!-- <label class="cursor-pointer label">
													<span class="label-text">save for other people to play</span>
													<input
														type="checkbox"
														bind:checked={toggleDatabase}
														class="toggle toggle-lg toggle-primary"
													/>
												</label> -->
											<div class="relative">
												<input
													type="text"
													bind:value={suggestedWord}
													on:keydown={(e) => {
														if (e.key === 'Enter') {
															handleSuggestedWord();
														}
													}}
													placeholder="suggested word"
													class="w-full select-auto input input-primary input-bordered" />
												<button
													on:click={handleSuggestedWord}
													class="absolute top-0 right-0 rounded-l-none btn btn-primary">
													suggest
												</button>
											</div>
										</div>
										<div class="modal-action">
											<label for="my-modal-2" class="btn">Close</label>
										</div>
									</div>
								</div>
							</li>
						{/if}
						<Suggestions />
					</ul>
				</div>
			</div>
		</div>
		<div>
			<div class="grid ">
				<div class="card bg-base-100 bordered shadow-lg ">
					<div class="card-body ">
						<h3 class="card-title">Game</h3>
						{#if $api.player?.twitch && !lobby.privateLobby}
							<span class="font-normal my-2"
								>join with <span class="font-bold">!code</span> or
								<span class="font-bold">!link</span> in chat (GeoBingoBot will answer)</span>
						{/if}

						<div class="grid gap-y-5">
							<div class="w-full"><ChangeGameMode gameMode="gah" /></div>
							<div class="label">{lobby.time} min</div>
							<input
								disabled={!isHost}
								type="range"
								max="60"
								min="1"
								on:input={(e) => {
									api.game.settings.changeTime(e.target.value);
								}}
								bind:value={$api.game.currentPhase.time}
								class="range range-primary" />
							<div class="label">
								max {$api.game.currentPhase.size} players
							</div>
							<input
								disabled={!isHost}
								type="range"
								max="100"
								min="1"
								on:input={(e) => {
									api.game.settings.changeSize(e.target.value);
								}}
								bind:value={$api.game.currentPhase.size}
								class="range range-secondary" />
							<div>
								{#if countryEnabled}
									<label class="label">
										<span class="label-text">country</span>
									</label>
									<div class="flex ">
										<div class="w-full">
											<select
												disabled={!isHost}
												on:change={(e) =>
													api.game.settings.changeCountry(e.target.value)}
												class="w-full select select-bordered select ">
												<option
													value={'all'}
													selected={'all' === $api.game.currentPhase.country}
													>{'all'}</option>
												{#each countries as country}
													<option
														value={country}
														selected={country == $api.game.currentPhase.country}
														>{country}</option>
												{/each}
											</select>
										</div>
										{#if isHost}
											<div
												class="tooltip tooltip-left"
												data-tip="get a random country">
												<button
													class="ml-2 btn btn-secondary"
													on:click={() =>
														api.game.settings.changeCountry(randomCountry())}
													><ShuffleIcon size="1x" /></button>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>
						<div class="form-control">
							<label class="label">
								<span class="label-text">invite link</span>
							</label>
							<div
								class="relative"
								on:pointerdown={() =>
									navigator.clipboard.writeText(
										window.location.href
											.split('#')[0]
											.split('?')[0]
											.replace(/#/g, '') +
											'?code=' +
											$api.game.currentPhase.title
									)}>
								<input
									type="text"
									on:input={(e) => e.preventDefault()}
									on:keydown={(e) => e.preventDefault()}
									value={window.location.href
										.split('#')[0]
										.split('?')[0]
										.replace(/#/g, '') +
										'?code=' +
										$api.game.currentPhase.title}
									class={`${
										$api.game.currentPhase.privateLobby ? 'blur-sm ' : ''
									}w-full pr-16 input input-secondary select-auto input-bordered`} />
								<button
									class="absolute top-0 right-0 rounded-l-none btn btn-secondary"
									><CopyIcon size="1x" /></button>

								<div class="form-control">
									<label class="mt-4 font-bold">settings</label>
									<label class="cursor-pointer label">
										<span class="label-text">switch words to the right</span>
										<input
											type="checkbox"
											on:click={() => {
												localStorage.getItem('switch')
													? localStorage.removeItem('switch')
													: localStorage.setItem('switch', '1');
											}}
											checked={localStorage.getItem('switch')}
											class="toggle" />
									</label>
									<label class="cursor-pointer label">
										<span class="label-text">hide ingame player scores</span>
										<input
											type="checkbox"
											on:click={() => {
												localStorage.getItem('hide')
													? localStorage.removeItem('hide')
													: localStorage.setItem('hide', '1');
											}}
											checked={localStorage.getItem('hide')}
											class="toggle" />
									</label>
									<label class="cursor-pointer label">
										<span class="label-text"
											>enable click to enter street view <br /> (much higher api
											cost)</span>
										<input
											type="checkbox"
											on:click={() => {
												localStorage.getItem('click')
													? localStorage.removeItem('click')
													: localStorage.setItem('click', '1');
											}}
											checked={localStorage.getItem('click')}
											class="toggle" />
									</label>
									<label class="cursor-pointer label">
										<span class="label-text">dark map</span>
										<input
											type="checkbox"
											on:click={() => {
												localStorage.getItem('darkMap')
													? localStorage.removeItem('darkMap')
													: localStorage.setItem('darkMap', '1');
											}}
											checked={localStorage.getItem('darkMap')}
											class="toggle" />
									</label>
									{#if isHost}
										<label class="cursor-pointer label">
											<span class="label-text"
												>don't show players in voting phase</span>
											<input
												type="checkbox"
												on:click={() =>
													api.game.settings.switchAnonVoting(
														!$api.game.currentPhase.anonVoting
													)}
												checked={$api.game.currentPhase.anonVoting}
												class="toggle" />
										</label>
										<label class="cursor-pointer label">
											<span class="label-text">only allow twitch players</span>
											<input
												type="checkbox"
												on:click={() =>
													api.game.settings.switchOnlyTwitch(
														!$api.game.currentPhase.onlyAuth
													)}
												checked={$api.game.currentPhase.onlyAuth}
												class="toggle" />
										</label>
										<label class="cursor-pointer label">
											<span class="label-text"
												>only allow twitch players to vote (prevents double
												voting)</span>
											<input
												type="checkbox"
												on:click={() =>
													api.game.settings.switchAllowEveryoneToVote(
														!$api.game.currentPhase.allowEveryoneToVote
													)}
												checked={!$api.game.currentPhase.allowEveryoneToVote}
												class="toggle" />
										</label>
									{/if}

									<label class="cursor-pointer label">
										<span class="label-text">toggle theme</span>
										<div><ThemePicker /></div>
									</label>
								</div>
							</div>
						</div>

						<button
							disabled={!isHost}
							class="btn btn-success my-2"
							on:click={() => api.game.currentPhase.startGame()}
							>start game</button>
					</div>
				</div>
				<div
					class=" flex justify-center items-center mt-4 card bg-base-100 bordered shadow-lg h-full">
					<h3 class="pt-2 card-title">Players</h3>
					<ul>
						{#each $api.game.currentPhase.players as player}
							<li class="my-2">
								<div class="flex ">
									<div
										class="text-center flex justify-center items-center w-6 font-bold text-xl">
										{api.game.currentPhase.score[player.id]?.points ?? 0}
									</div>
									<Profile {player} />
								</div>
							</li>
						{/each}
					</ul>
					<div class="card-body" />
				</div>
			</div>
		</div>
	</div>
</div>
