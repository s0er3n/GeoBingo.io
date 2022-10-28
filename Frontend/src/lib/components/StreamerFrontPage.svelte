<script>
  import { browser } from "$app/environment";

  export let streamerFrontPage;
</script>

<div class="aspect-video w-full p-5">
  <iframe
    class="w-full h-full shadow-2xl  "
    src={`https://player.twitch.tv/?channel=${streamerFrontPage}&parent=${
      browser ? window.location.hostname : ""
    }`}
    allowfullscreen="true"
  />
</div>
