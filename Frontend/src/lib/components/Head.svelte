<script>
  import { api } from "$lib/js/api";
  import Inventory from "./Inventory.svelte";
  import { ChevronLeftIcon } from "svelte-feather-icons";
  import SavedLocations from "./SavedLocations.svelte";
</script>

<div class="flex justify-between m-0 p-0">
  <div class="flex items-center space-x-2">
    <button class="btn btn-warning my-2" on:click={() => api.player.leave()}
      ><ChevronLeftIcon class="" size="1x" />leave Game</button
    >

    <input
      class={`hidden sm:flex input col-span-2 input-primary rounded input-bordered ${
        $api.game.currentPhase.privateLobby ? "blur-sm" : ""
      }`}
      value={$api.game.currentPhase.title}
      on:click={(e) => {
        navigator.clipboard.writeText($api.game?.currentPhase?.title);
      }}
      on:keydown={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText($api.game?.currentPhase?.title);
      }}
    />
  </div>
  <Inventory />
  <SavedLocations />
</div>
