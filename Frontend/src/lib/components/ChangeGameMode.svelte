<script lang="ts">
  import { api } from "$lib/js/api";
  export let gameMode: "gah" | "game";
</script>

<button
  class="btn w-full"
  disabled={!$api.isHost}
  on:click={() => {
    api.player.changeGameMode(gameMode);
  }}>change game mode</button
>
