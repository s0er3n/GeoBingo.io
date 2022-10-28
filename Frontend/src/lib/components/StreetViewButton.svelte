<script>
  import { map } from "$lib/components/Map.svelte";
  import { shortcut } from "$lib/js/shortcut.js";

  export let onlyOfficialCoverage;

  let click = localStorage.getItem("click");
  const handleSpace = () => {
    if ($map.map) {
      $map.sv.setVisible(true);
      $map.sv.setPano($map.pano);
    }
  };

  let streetViewLayer = $map.loaded
    ? new google.maps.StreetViewCoverageLayer()
    : undefined;

  let svShowing = false;
  const switchStreetViewCoverage = () => {
    if (!streetViewLayer) {
      streetViewLayer = $map.loaded
        ? new google.maps.StreetViewCoverageLayer()
        : undefined;
    }
    if (svShowing) {
      svShowing = !svShowing;
      streetViewLayer?.setMap(null);
    } else {
      svShowing = !svShowing;
      streetViewLayer?.setMap($map.map);
    }
  };
</script>

<div class="grid xl:flex">
  {#if click || onlyOfficialCoverage}
    <button
      class="btn btn-wide  m-4  "
      use:shortcut={{ code: "Space", default: true }}
      on:click={handleSpace}>Enter Street View (space)</button
    >
  {/if}

  <button
    class="btn  btn-wide m-4  z-[5000]"
    on:click={switchStreetViewCoverage}>Switch Street view showing</button
  >
</div>
