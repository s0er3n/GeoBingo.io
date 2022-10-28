<script>
  import { api } from "$lib/js/api";
  import { CopyIcon } from "svelte-feather-icons";
  $: isHost = $api.isHost;
</script>

<label class="label pt-4">
  <span class="label-text font-bold uppercase">invite link</span>
</label>
<div
  class="relative"
  on:pointerdown={() =>
    navigator.clipboard.writeText(
      window.location.href.split("#")[0].split("?")[0].replace(/#/g, "") +
        "?code=" +
        $api.game.currentPhase.title
    )}
>
  <input
    type="text"
    on:input={(e) => e.preventDefault()}
    on:keydown={(e) => e.preventDefault()}
    value={window.location.href.split("#")[0].split("?")[0].replace(/#/g, "") +
      "?code=" +
      $api.game.currentPhase.title}
    class={`${
      $api.game.currentPhase.privateLobby ? "blur-sm " : ""
    }w-full pr-16 input input-secondary input-bordered select-auto`}
  />
  <button class="absolute top-0 right-0 rounded-l-none btn btn-secondary"
    ><CopyIcon size="1.5x" /></button
  >
</div>
