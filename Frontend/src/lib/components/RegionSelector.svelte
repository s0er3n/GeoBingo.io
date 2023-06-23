<script>
  import socket from "$lib/js/socket";

  import { api } from "$lib/js/api";
  let data = [];
  let currData = {};
  function init(node) {
    const map = L.map(node, { zoomControl: false }).setView([0, 0], 0);
    let googleStreets = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}?hl=en",
      {
        maxZoom: 20,
        attribution: "Google",
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );
    googleStreets.addTo(map);

    map.on("click", async (e) => {
      selected = true;
      socket.emit("region:getRegion", e.latlng.lat, e.latlng.lng, (d) => {
        data = Object.entries(d);
        currData = d;
      });
    });
  }
  let selected = false;
</script>

<div class="w-full font-bold">
  select the region you want to have it restricted to:
</div>
{#if !selected}
  <div class="h-96 w-full" use:init />
{/if}
<table class="table flex flex-col w-full">
  {#each data.filter(([key, value]) => !["latitude", "longitude"].includes(key)) as [key, value]}
    <tr
      class="flex p-2 flex-col md:flex-row flex-wrap justify-between items-center w-full h-full"
    >
      <td class="font-bold md:w-12">{key}:</td>
      <td>{value ? value : "no " + key}</td>
      <td
        class="btn"
        on:click={() => {
          $api.game.settings.changeRestriction({
            key,
            val: value,
            lat: currData.latitude,
            lng: currData.longitude,
          });
        }}>select</td
      >
    </tr>
  {/each}
</table>
