<script lang="ts">
  import Head from "$lib/components/Head.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import { api } from "$lib/js/api";
  import { VotingPhase } from "$lib/js/GeoBingoAgainstHumanity";
  import StreetView from "./components/StreetView.svelte";
  import {
    HeartIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
  } from "svelte-feather-icons";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import SentenceWithStreetView from "./components/SentenceWithStreetView.svelte";

  let movingFree = false;
  let movingFreeIndex = 0;

  const setMovingFreeIndex = (change: number) => {
    if (!movingFree) {
      movingFree = true;
      movingFreeIndex = captureIndex;
    }
    movingFreeIndex = movingFreeIndex + change;
  };
  $: votingPhase =
    $api.game.currentPhase instanceof VotingPhase
      ? $api.game.currentPhase
      : undefined;
  $: captures = votingPhase.captures;
  $: captureIndex = movingFree ? movingFreeIndex : votingPhase.captureIndex;
  $: currentCapture = captures[captureIndex];
  $: console.log(currentCapture, captureIndex);

  $: console.log(votingPhase);
</script>

<div id="" class="px-2 h-screen flex flex-col  justify-stretch">
  <Head />
  <SentenceWithStreetView phase={votingPhase} capture={currentCapture} />
  <div class="flex justify-center w-full">
    <!-- <Profile player={currentCapture.player} /> -->

    <div class="pt-2 w-full ">
      <div class="grid bg-base-100 rounded-md shadow-md w-full">
        <div class="p-2 text-center">{captureIndex + 1}/{captures.length}</div>
        <div class="p-2 text-center font-bold">
          {$api.game.currentPhase?.totalVotes} total vote{#if $api.game.currentPhase?.totalVotes !== 1}s{/if}
          from {votingPhase.players.filter((player) => player.online).length} online
          players
        </div>
        {#if $api.isHost}
          <div class="p-2 justify-self-center">
            <button
              class="btn btn-primary btn-xs"
              on:click={votingPhase?.goToScore}>go to score</button
            >
          </div>
        {:else if movingFree}
          <div class="p-2 justify-self-center">
            <button
              class="btn btn-primary btn-xs"
              on:click={() => {
                movingFree = false;
              }}>sync with host again</button
            >
          </div>
        {/if}
        <div
          class="h-min shadow-md flex justify-center items-center bg-base-100 rounded-md shadow-xl"
        >
          {#if captureIndex !== 0}
            <button
              on:click={() => {
                if ($api.isHost) {
                  votingPhase?.setCaptureIndex(votingPhase.captureIndex - 1);
                } else {
                  setMovingFreeIndex(-1);
                }
              }}><ChevronLeftIcon size="2x" /></button
            >
          {:else}
            <button disabled={true}>
              <ChevronLeftIcon strokeWidth="1px" size="2x" /></button
            >
          {/if}

          <div
            class="tooltip"
            data-tip={currentCapture.player.id === $api.player.id
              ? "you cannot vote for yourself "
              : "you only have one vote"}
          >
            <button on:click={() => votingPhase.vote(captureIndex)}>
              {#if votingPhase.voting[captureIndex]?.includes($api.player.name)}
                <HeartIcon strokeWidth="3px" class="text-red-700" size="4x" />
              {:else}
                <HeartIcon strokeWidth="1px" class="" size="4x" />
              {/if}
            </button>
          </div>
          {#if captureIndex < captures.length - 1}
            <button
              on:click={() => {
                if ($api.isHost) {
                  votingPhase?.setCaptureIndex(votingPhase.captureIndex + 1);
                } else {
                  setMovingFreeIndex(1);
                }
              }}><ChevronRightIcon size="2x" /></button
            >
          {:else}
            <button disabled={true}
              ><ChevronRightIcon strokeWidth="1px" size="2x" /></button
            >
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
