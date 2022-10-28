<script lang="ts">
  import { api } from "$lib/js/api";
  import { Ingame } from "$lib/js/GeoBingoAgainstHumanity";
  import { CameraIcon, CheckIcon } from "svelte-feather-icons";

  import { map } from "$lib/components/Map.svelte";
  $: ingame =
    $api.game.currentPhase instanceof Ingame
      ? $api.game.currentPhase
      : undefined;
  const getWhichPicture = (index: number) => {
    let i = 0;
    for (const c of ingame.card.text.slice(0, index)) {
      if (c === "_") {
        i++;
      }
    }
    return i;
  };

  // FIXME GET LOC FROM GOOGLE MAPS

  $: captures = ingame?.captures.find(
    (obj) => obj.player.id === $api.player.id
  )?.captures;
  $: captureIndices = captures ? Object.keys(captures) : [];
  $: console.log(captureIndices, captures);

  const makePhoto = (i: number) => {
    let streetview = $map.map.getStreetView();
    try {
      let pano = { pano: streetview.pano, pov: streetview.pov };
      let position = {
        lat: streetview.position.lat(),
        long: streetview.position.lng(),
      };

      if (streetview.pano === undefined) {
        throw "no pano";
      }
      ingame.makeCapture(i, { pano, position });
    } catch (e) {
      alert("You can only take photos in Streetview");
      console.log(e);
    }
  };
</script>

<div class="w-full flex justify-center">
  <div
    class="flex w-3/4 item-scenter absolute bottom-0 justify-center shadow-xl rounded-md"
  >
    <div class="p-2 text-xl bg-base-100  z-50 ">
      {#each ingame.card.text as c, i}
        {#if c === "_"}
          <button
            on:click={() => {
              let pictureIndex = getWhichPicture(i);
              makePhoto(pictureIndex);
            }}
          >
            {#if !captureIndices.includes(String(getWhichPicture(i)))}
              <div class="px-2 btn  btn-xs w-16">
                <CameraIcon size="1x" />
              </div>
            {:else}
              <div class="px-2 btn btn-success btn-xs w-16">
                <CheckIcon size="1x" />
              </div>
            {/if}
          </button>
        {:else}
          {c}
        {/if}
      {/each}
    </div>
  </div>
</div>
