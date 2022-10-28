<script lang="ts">
  import { api } from "$lib/js/api";
</script>

<label class="cursor-pointer label pt-4">
  <span class="label-text uppercase">only allow twitch players</span>
  <input
    type="checkbox"
    on:click={(e) => {
      e.preventDefault();
      if ($api.isHost) {
        api.game.settings.switchOnlyTwitch(!$api.game.currentPhase.onlyAuth);
      }
    }}
    checked={$api.game.currentPhase.onlyAuth}
    class="toggle"
  />
</label>
