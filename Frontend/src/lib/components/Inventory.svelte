<script>
  import { ArchiveIcon } from "svelte-feather-icons";
  import { api } from "$lib/js/api";

  export let ghost = false;
</script>

{#if $api.player.twitch}
  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="my-modal-4" class="modal-toggle" />
  <label for="my-modal-4" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h1>Your Inventory (click to choose)</h1>
      <div class="grid grid-cols-9 content-center">
        {#each $api.player.auth.emotes ?? [] as emote, i}
          <div
            on:click={() => api.player.updateEquipedSkin(i)}
            class={` ${
              $api.player.auth.equiped === i
                ? "border border-black rounded-sm p-1"
                : " "
            } flex items-center content-center justify-center  w-12 h-12`}
          >
            <img src={emote} />
          </div>
        {/each}
      </div>
      {#if $api.player.auth.emotes.length === 0}
        <p class="text-xs">
          you don't have any items :( <br /> you can get items by donating but make
          sure to use the same email as your twitch account
        </p>
      {/if}
    </label>
  </label>
{/if}
{#if !ghost}
  {#if $api.player.twitch}
    <label for="my-modal-4" class="m-2 btn btn-info modal-button "
      >Inventory<ArchiveIcon size="1x" class="ml-2" />
    </label>
  {/if}
{:else}
  <label disabled={!api.player.twitch} for="my-modal-4"><slot /></label>
{/if}
