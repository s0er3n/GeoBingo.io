<script>
	import Carousel from '$lib/components/Carousel.svelte';
	import Discord from '$lib/components/Discord.svelte';
	import Login from '$lib/components/Login.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Socials from '$lib/components/Socials.svelte';
	import StreamerFrontPage from '$lib/components/StreamerFrontPage.svelte';
	import YoutubeVideo from '$lib/components/YoutubeVideo.svelte';
	import { api } from '$lib/js/api';
	// let events = [
	// 	{
	// 		image: 'ukraine.jpg.webp',
	// 		link: 'https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi'
	// 	},
	// 	{
	// 		image: 'FMYn0keWUAABtRY.png',
	// 		link: 'https://donate.redcrossredcrescent.org/ua/donate/~my-donation'
	// 	}
	// ];
	let events = [
		{
			image: 'wordle.png',
			link: 'https://satellitedle.com'
		}
	];
	// let events = [];
	let disabled = false;
</script>

<div class="grid">
	<div class="flex flex-col  ">
		<div class="flex flex-wrap gap-5 justify-center items-center p-8">
			<div class="p-2 w-96">
				<img class=" rounded-md  back shadow-2xl" src="cover.png" alt="" />
			</div>
			<div class="w-full flex justify-center items-center">
				<Socials />
			</div>
		</div>

		<div
			class="w-full sm:flex justify-center flex-cols  md:flex-row-reverse text-center items-center">
			<div class="w-full flex justify-center items-center">
				{#if $api?.player}
					<Login />
				{:else}
					<ul
						class="animate-pulse w-full menu py-4 h-96 shadow-lg bg-slate-200 rounded-box">
						<li class="menu-title w-full" />
						<li class="w-full justify-center text-center items-center flex">
							loading...
						</li>
					</ul>
					<!-- TODO: add loading animation -->
				{/if}
			</div>
			{#if $api.streamerFrontPage}
				<StreamerFrontPage streamerFrontPage={$api.streamerFrontPage} />
			{:else if events.length}
				<Carousel {events} bind:disabled />
				<!-- <YoutubeVideo /> -->
			{:else}
				<Discord />
			{/if}
		</div>
	</div>
</div>
