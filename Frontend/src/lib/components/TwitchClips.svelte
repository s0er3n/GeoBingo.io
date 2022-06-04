<script>
	import { dev } from '$app/env';
</script>

<div class="grid bg-base-100 items-center content-center justify-center">
	<div class="flex-cols justify-center lg:flex items-center">
		<iframe
			class="m-5 p-2 basis-1/2 sm:h-[360px] sm:w-[480px] shadow-2xl  "
			src="https://clips.twitch.tv/embed?clip=AbstruseMiniatureGrassDeIlluminati-LkV3KKN9ha2GlQ28&parent={!dev
				? 'geobingo.io'
				: 'localhost'}"
			allowfullscreen="true" />
		<div class="flex basis-1/2 p-5 sm:w-[480px]">
			<h2 class="text-2xl align-text-middle font-thin title ">
				search things in street view
			</h2>
		</div>
	</div>
	<div
		class="flex-cols justify-center lg:flex lg:flex-row-reverse items-center">
		<iframe
			class="m-5 p-2 basis-1/2 sm:h-[360px] sm:w-[480px] shadow-2xl  "
			src="https://clips.twitch.tv/embed?clip=TenuousMotionlessTriangleThisIsSparta-aSutnfheL_ouV_o1&parent={!dev
				? 'geobingo.io'
				: 'localhost'}"
			allowfullscreen="true" />
		<div class="flex basis-1/2 p-5 sm:w-[480px]">
			<h2 class="text-2xl align-text-middle font-thin title ">
				look at what everybody found
			</h2>
		</div>
	</div>
</div>
