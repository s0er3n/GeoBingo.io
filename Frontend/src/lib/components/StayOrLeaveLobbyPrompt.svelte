<script lang="ts">
  import { browser } from "$app/environment";
  import { api } from "$lib/js/api";
  let differentLobby = true;
  let code: string | undefined;

  if (browser) {
    let url = new URL(window.location.href.split("#")[0]);
    code = url.searchParams.get("code");

    console.log("code", code);
  }
</script>

<!-- checking giving player a warning if they are in a different room than the link they used -->
<div
  class={`modal ${
    differentLobby &&
    $api.game &&
    !($api.game.currentPhase.title === code || !code)
      ? "modal-open"
      : ""
  }`}
>
  <div class="modal-box">
    <p>
      It seems like you used a link to a different room. You want to leave the
      current room?
    </p>
    <div class="modal-action">
      <button
        on:click={() => {
          differentLobby = false;
        }}
        for="my-modal-2"
        class="btn">Stay</button
      >
      <button on:click={() => api.player.leave()} class="btn btn-primary"
        >Leave</button
      >
    </div>
  </div>
</div>
