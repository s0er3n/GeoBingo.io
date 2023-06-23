<script lang="ts">
  import { api } from "$lib/js/api";
  let countries = $api.countries;
  $: isHost = $api.isHost;
</script>

<div class="label uppercase pt-4">country</div>
<div class="flex">
  <div class="w-full">
    <select
      disabled={!isHost}
      on:change={(e) =>
        api.game.settings.changeRestriciton({
          key: "countryName",
          val: e.target.value,
        })}
      class="w-full select select-bordered select"
    >
      <option
        value={"all"}
        selected={null === $api.game.currentPhase.restriction}>{"all"}</option
      >
      {#each countries as country}
        <option
          value={country}
          selected={country == $api.game.currentPhase.restriction}
          >{country}</option
        >
      {/each}
    </select>
  </div>
</div>
