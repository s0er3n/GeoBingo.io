<script>
  import { onDestroy } from "svelte";
  import { api } from "$lib/js/api";

  let oldTimeout;
  let typing = false;
  let name = "guest";
  let unsubscribe = api.subscribe((c) => {
    // FIXME: not loading
    if (!typing && c.player?.auth) {
      name = c.player.auth.name;
    }
  });

  onDestroy(() => unsubscribe());
</script>

<input
  on:keyup={(e) => {
    typing = true;
    if (oldTimeout) {
      clearTimeout(oldTimeout);
    }
    oldTimeout = setTimeout(() => {
      api.player.changeName(e.target.value);
    }, 1000);
  }}
  value={name}
  type="text"
  placeholder="username"
  class="input input-bordered w-full select-auto"
/>
