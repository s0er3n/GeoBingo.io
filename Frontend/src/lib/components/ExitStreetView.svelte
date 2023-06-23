<script>
  import { map } from "$lib/components/Map.svelte";
  import { shortcut } from "$lib/js/shortcut.js";
  import { ArrowLeftIcon } from "svelte-feather-icons";
</script>

<button
  class="btn m-4 z-[5000]"
  use:shortcut={{ code: "Escape" }}
  on:click={() =>
    $map.wait.then(() => {
      $map.map.getStreetView().setVisible(false);
    })}
>
  <ArrowLeftIcon size="1x" /> (esc)</button
>
