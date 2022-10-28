<script lang="ts">
  import { Score } from "$lib/js/GeoBingoAgainstHumanity";
  import Profile from "$lib/components/Profile.svelte";
  import { api } from "$lib/js/api";
  import Head from "$lib/components/Head.svelte";
  import type Player from "../../../../../Backend/src/objects/Player";
  import SentenceWithStreetView from "./components/SentenceWithStreetView.svelte";
  import Celebration from "$lib/components/Celebration.svelte";
  $: score =
    $api.game.currentPhase instanceof Score
      ? $api.game.currentPhase
      : undefined;
  function getWinnerCapture(winner: Player) {
    return score.captures.find((c) => {
      return c.player.id === winner.id;
    });
  }
  $: winner = JSON.parse(score?.score?.sort((a, b) => b[1] - a[1])[0][0]);
  let opened = 0;
</script>

{#if winner.auth?.emotes?.length > 0}
  <Celebration emote={winner.auth.emotes[winner.auth.equiped]} />
{/if}
<div class="px-2 h-full">
  <Head />

  <div
    class="grid grid-cols-2 justify-center items-center bg-base-100 p-2 rounded-md"
  >
    <div
      class="text-2xl col-span-2 font-bold w-full flex justify-center items-center"
    >
      Score
    </div>
    <div class="text-center font-bold">Votes</div>
    <div class="text-center font-bold">Player</div>
    {#each score.score.sort((a, b) => b[1] - a[1]) as playerAndScore, i}
      <div
        on:click={() => {
          if (i === opened) {
            opened = undefined;
            return;
          }
          opened = i;
        }}
        class="flex justify-center items-center text-center font-bold border-t-2 border-primary h-full p-2"
      >
        {playerAndScore[1]}
      </div>
      <div
        on:click={() => {
          if (i === opened) {
            opened = undefined;
            return;
          }
          opened = i;
        }}
        class="flex justify-start border-t-2 border-primary h-full p-2"
      >
        <Profile player={JSON.parse(playerAndScore[0])} />
      </div>
      {#if opened === i}
        <div class="w-full h-full col-span-2 bg-base-100">
          <SentenceWithStreetView
            phase={score}
            capture={getWinnerCapture(JSON.parse(playerAndScore[0]))}
          />
        </div>
      {/if}
    {/each}
  </div>
  <div class="pt-16 flex justify-center items-center">
    <button
      disabled={!api.isHost}
      class="btn btn-primary"
      on:click={score.goToLobby}>go to lobby</button
    >
  </div>
</div>
