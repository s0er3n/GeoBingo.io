<script>
	import CaptureMenu from '$lib/components/CaptureMenu.svelte';
	import ExitStreetView from '$lib/components/ExitStreetView.svelte';
	import Map, { map } from '$lib/components/Map.svelte';
	import ScoreInGame from '$lib/components/ScoreInGame.svelte';
	import StreetViewButton from '$lib/components/StreetViewButton.svelte';
	import TopCenter from '$lib/components/TopCenter.svelte';
	import { onMount } from 'svelte';

	import { api } from '$lib/js/api';

	let fullscreenButton = false;
	function fullscreen() {
		try {
			document.getElementById('full').requestFullscreen();
			document.getElementById('full').style.height = window.innerHeight + 'px';
		} catch (e) {
			console.log(e);
		}
	}
	window.onbeforeunload = function () {
		return '';
	};

	let click = localStorage.getItem('click');
	let hidePlayers = localStorage.getItem('hide');
	let mapOptions = {
		center: { lat: 0, lng: 0 },
		zoom: 2,
		disableDefaultUI: true,
		zoomControl: false
	};

	if ($api.game.currentPhase.onlyOfficialCoverage) {
		mapOptions['streetViewControl'] = false;
	} else {
		mapOptions['streetViewControl'] = true;
	}

	onMount(() => {
		$map.wait.then(() => {
			mapOptions['streetViewControlOptions'] = {
				position: google.maps.ControlPosition.RIGHT_BOTTOM
			};
			$map.map.get('streetView').setOptions({
				disableDefaultUI: true,
				enableCloseButton: false,
				motionTracking: false,
				panControl: true,
				zoomControl: false,
				clickToGo: true
			});

			if ($api.game.currentPhase.country !== 'all') {
				let country = $api.game.currentPhase.country;
				// let countryBounds = $api.bounds[country];
				// console.log(countryBounds);
				// $map.map.setOptions({
				// 	restriction: { latLngBounds: countryBounds, strictBounds: false }
				// });
			}
			if (click || $api.game.currentPhase.onlyOfficialCoverage) {
				const infowindow = new google.maps.InfoWindow({
					content: 'press space for street view'
				});
				let marker = new google.maps.Marker({});
				infowindow.open({
					anchor: marker,
					map: $map.map,
					shouldFocus: true
				});

				google.maps.event.addListener($map.map, 'click', function (event) {
					$map.svs
						.getPanorama(
							$api.game.currentPhase.onlyOfficialCoverage
								? {
										location: event.latLng,
										radius: 1000,
										source: google.maps.StreetViewSource.OUTDOOR,
										preference: google.maps.StreetViewPreference.NEAREST
								  }
								: {
										location: event.latLng,
										radius: 1000,
										preference: google.maps.StreetViewPreference.NEAREST
								  }
						)
						.then((p) => {
							console.log(p);
							$map.pano = p.data.location.pano;

							marker.setPosition(p.data.location.latLng);
							marker.setMap($map.map);
						})
						.catch((e) => console.log(e));
				});
			}

			let ExitStreetViewElement = document.createElement('div');
			let EnterStreetViewElement = document.createElement('div');

			let enterStreetView = new StreetViewButton({
				target: EnterStreetViewElement,
				props: {
					onlyOfficialCoverage: $api.game.currentPhase.onlyOfficialCoverage
				}
			});
			let exitStreetView = new ExitStreetView({
				target: ExitStreetViewElement,
				props: {}
			});
			let streetView = $map.sv;

			streetView.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
				ExitStreetViewElement
			);

			$map.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
				EnterStreetViewElement
			);
			$map.map.setOptions(mapOptions);
			if (navigator?.userAgentData?.mobile) {
				fullscreenButton = true;

				fullscreen();
			}
		});
	});
</script>

<div id="full" class="select-none max-h-full h-full">
	<div class="pointer-events-none hidden md:block absolute z-10">
		<img
			class="w-48 m-2 rounded-2m opacity-90 back shadow-2xl"
			src="cover.png"
			alt="" />
	</div>
	{#if fullscreenButton}
		<div class="absolute z-10 right-0">
			<button on:click={fullscreen} class="btn m-2">fullscreen</button>
		</div>
	{/if}
	{#if !hidePlayers}
		<ScoreInGame />
	{/if}
	<CaptureMenu />
	<TopCenter />
	<Map {mapOptions} />
</div>
