<script lang="ts">
  import Profile from "$lib/components/Profile.svelte";
  import Socials from "$lib/components/Socials.svelte";
  import { Lobby as L } from "$lib/js/MMGame";
  import Head from "$lib/components/Head.svelte";
  import { api } from "$lib/js/api";
  import { LoaderIcon } from "svelte-feather-icons";

  // magic line for type things
  $: lobby =
    $api.game.currentPhase instanceof L ? $api.game.currentPhase : undefined;

  const lang = navigator.language || navigator.userLanguage;

  let countries = $api.countries;
  let lockedWords = [];
  let countryEnabled = true;

  let words = api.game.currentPhase.words;
  function getOnlinePLayers(players) {
    return players.filter((player) => player.online).length;
  }

  $: playersOnline = getOnlinePLayers(lobby.players);
  show_preroll();
</script>

<div class="p-2">
  <Head />
  <div class="flex w-full justify-center items-center">
    <Socials />
  </div>
  <div
    class=" flex justify-center items-center mt-4 card bg-base-100 bordered shadow-lg h-full"
  >
    <h3 class="pt-2 card-title">
      Public Lobby <LoaderIcon class="animate-spin " size="1x" />
    </h3>
    <ul class="p-2">
      {#each $api.game.currentPhase.players as player}
        <li class="my-2">
          <div class="flex ">
            <div
              class="text-center flex justify-center items-center w-6 font-bold text-xl"
            >
              {api.game.currentPhase.score[player.id]?.points ?? 0}
            </div>
            <Profile {player} />
          </div>
        </li>
      {/each}
    </ul>
    <div class="card-body" />
  </div>
</div>
