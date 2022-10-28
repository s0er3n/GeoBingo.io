<script>
  import { supabase } from "$lib/js/supabaseClient";
  let getPhotospheres = async () =>
    await supabase.from("reportedPhotospheres").select("*");
  let i = 0;
  let deleteReported = async (val) =>
    await supabase.from("reportedPhotospheres").delete().eq("panoid", val);

  let googleMapsApiKey = import.meta.env.VITE_GMAPSAPI;
</script>

<div class="h-screen">
  {#await getPhotospheres() then data}
    {i}
    {data.data[i].reason}
    {data.data[i].playerid}
    <iframe
      title="google maps"
      id="pano"
      frameborder="8"
      style=""
      height="80%"
      width="100%"
      src={`https://www.google.com/maps/embed/v1/streetview?key=${googleMapsApiKey}&pano=${data.data[i].panoid}`}
      allowfullscreen
    />
    <button
      class="btn"
      on:click={() => {
        deleteReported(data.data[i].panoid);
        i += 1;
      }}
    >
      not nsfw
    </button>
    <button class="btn " on:click={() => (i += 1)}> next </button>
    <input bind:value={i} />
  {/await}
</div>
