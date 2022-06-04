<script>
	import Kofi from '$lib/components/Kofi.svelte';
	import { InstagramIcon, YoutubeIcon, TwitchIcon } from 'svelte-feather-icons';
</script>

<div class=" flex flex-wrap gap-2">
	<a href="https://discord.gg/feBpPHVJ3h" target="_blank">
		<img src="discord.svg" class="p-2 rounded-md h-10 shadow-md bg-blue-600" />
	</a>
	<a href="https://www.twitch.tv/directory/game/GeoBingo.io" target="_blank">
		<div
			class="p-2 rounded-md h-10 shadow-md bg-purple-600  flex justify-center items-center gap-1">
			<TwitchIcon size="1x" /> Twitch
		</div>
	</a>
	<a href="https://www.tiktok.com/@geobingo" target="_blank">
		<img src="TikTok.svg" class="p-2 rounded-md h-10 shadow-md bg-slate-100" />
	</a>
	<a
		href="https://www.youtube.com/channel/UCEB92TvBTby2GeDyU2ak8Dg"
		target="_blank">
		<div
			class="p-2 rounded-md h-10 shadow-md bg-red-700  flex justify-center items-center gap-1">
			<YoutubeIcon size="1x" /> YouTube
		</div>
	</a>
	<a href="https://www.instagram.com/geobingo.io/" target="_blank">
		<div
			class="p-2 rounded-md h-10 shadow-md bg-slate-500  flex justify-center items-center gap-1">
			<InstagramIcon size="1x" /> Instagram
		</div>
	</a>
	<Kofi />
</div>
