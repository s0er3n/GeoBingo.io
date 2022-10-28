<script>
  import TopCenter from "$lib/components/TopCenter.svelte";
  import TopCaptureMenu from "./components/TopCaptureMenu.svelte";
  import Map, { map } from "$lib/components/Map.svelte";
  import { api } from "$lib/js/api";
  import ExitStreetView from "$lib/components/ExitStreetView.svelte";
  import StreetViewButton from "$lib/components/StreetViewButton.svelte";
  import { Ingame } from "$lib/js/GeoBingoAgainstHumanity";
  import { onMount } from "svelte";

  $: ingame =
    $api.game.currentPhase instanceof Ingame
      ? $api.game.currentPhase
      : undefined;

  let mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: true,
  };
  onMount(() => {
    $map.wait.then(() => {
      let streetView = $map.sv;

      streetView.setOptions({
        disableDefaultUI: true,
        enableCloseButton: false,
        motionTracking: false,
        panControl: true,
        zoomControl: false,
        clickToGo: true,
      });

      let ExitStreetViewElement = document.createElement("div");

      let exitStreetView = new ExitStreetView({
        target: ExitStreetViewElement,
        props: {},
      });

      streetView.controls[google.maps.ControlPosition.TOP_LEFT].push(
        ExitStreetViewElement
      );

      let streetViewDiv = document.createElement("div");
      streetViewDiv.classList.add("hidden");
      streetViewDiv.classList.add("md:flex");

      let streetViewButton = new StreetViewButton({
        target: streetViewDiv,
        props: { onlyOfficialCoverage: false },
      });
      $map.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        streetViewDiv
      );
    });
  });
  function checkIfCaptureComplete(capture) {
    const picks = ingame.card.pick;
    for (let i = 0; i < picks; i++) {
      if (!capture.captures[i]) {
        return false;
      }
    }
    return true;
  }
  $: finnishedCapture = ingame.captures.filter((c) =>
    checkIfCaptureComplete(c)
  ).length;
  $: playersOnline = ingame.players.filter((p) => p.online).length;
</script>

<div class="absolute z-50 top-2 right-2 p-2">
  <div class="flex flex-col space-y-2">
    {#if $api.isHost}
      <button
        class="btn uppercase"
        on:click={() => {
          $api.game.currentPhase.endGame();
        }}
      >
        end game
      </button>
    {/if}
    <button
      class="btn uppercase"
      on:click={() => {
        $api.player.leave();
      }}
    >
      leave game
    </button>
  </div>
</div>
<div
  class="absolute flex pointer-events-none justify-center top-16  z-50 w-full text-center "
>
  <div class="bg-base-100 p-2 shadow-md">
    {finnishedCapture}/{playersOnline}
  </div>
</div>
<TopCaptureMenu />
<TopCenter />

<Map {mapOptions} />
