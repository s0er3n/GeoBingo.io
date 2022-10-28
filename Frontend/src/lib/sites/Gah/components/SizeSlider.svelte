<script>
  import { api } from "$lib/js/api";
  $: isHost = $api.isHost;
</script>

<div class="label uppercase pt-4">
  {$api.game.currentPhase.size} players
</div>
<input
  disabled={!isHost}
  type="range"
  max="100"
  min="1"
  on:input={(e) => {
    api.game.settings.changeSize(e.target.value);
  }}
  bind:value={$api.game.currentPhase.size}
  class="range range-secondary"
/>
