<script context="module">
	import { writable } from 'svelte/store';

	class Map {
		constructor() {
			this._loaded = false;
			this._map;
			this._items;
			this.resolvePromise;

			this.wait = new Promise((resolve) => {
				this.resolvePromise = resolve;

				if (this._loaded) {
					resolve();
				}
			});
		}
		get loaded() {
			return this._loaded;
		}
		set map(map) {
			this._loaded = true;
			this.resolvePromise();
			this._map = map;
		}
		get map() {
			return this._map;
		}

		addItem({ position, icon, title }) {
			if (this._loaded) {
				this._items.push(
					new google.maps.Marker({
						position,
						map: this._map,
						icon,
						title
					})
				);
			} else {
				throw 'couldnt add items to Map bc its not loaded';
			}
		}
	}
	export const map = writable(new Map());
</script>

<script>
	import LoadGoogleMaps, {
		loadGoogleMaps
	} from '$lib/components/LoadGoogleMaps.svelte';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';

	export let mapOptions = {
		center: { lat: 0, lng: 0 },
		zoom: 2,
		zoomControl: false,
		disableDefaultUI: true
	};
	if (localStorage.getItem('darkMap') === '1') {
		mapOptions.mapId = '1deb78b225b46ac6';
	}

	let getPano;
	$loadGoogleMaps
		.then(() => {
			$map.map = new google.maps.Map(
				document.getElementById('map'),
				mapOptions
			);
			$map.sv = $map.map.getStreetView();
			$map.svs = new google.maps.StreetViewService();
		})
		.catch((reason) => {
			// Probably @googlemaps/js-api-loader
			console.log(reason);
		});

	onMount(() => {
		if (browser) {
			// let elm = document.getElementById('map');
			// // Do something with 'initialWidth'
			// elm?.setAttribute('style', 'height:' + window.innerHeight + 'px;');
			// elm?.setAttribute('style', 'width:' + window.innerWidth + 'px;');
			// window.addEventListener('resize', function () {
			// 	let elm = document.getElementById('map');
			// 	// Do something with 'initialWidth'
			// 	elm?.setAttribute('style', 'width:' + window.innerWidth + 'px;');
			// 	elm?.setAttribute('style', 'height:' + window.innerHeight + 'px;');
			// });
		}
	});
</script>

<LoadGoogleMaps />
<div
	class="absolute h-full w-full flex flex-col justify-stretch overflow-hidden">
	<div id="map" class="w-full h-full  " />
</div>
