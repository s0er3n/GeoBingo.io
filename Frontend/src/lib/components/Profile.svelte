<script>
  // import Auth from '$lib/components/Auth.svelte';
  import Inventory from "./Inventory.svelte";
  import { api } from "$lib/js/api";
  import { UserMinusIcon, ZapIcon } from "svelte-feather-icons";

  export let player;
  export let small = false;
  let kickModal = false;
  let playerToHost = false;

  $: playerIsHost = api.getHost(player.id);
  let playerToKick;

  if ($api.player.id === player.id && !localStorage.getItem("donator")) {
    for (const badge of player.auth.badges) {
      if (badge.toLowerCase().startsWith("donator")) {
        localStorage.setItem("donator", "true");
        break;
      }
    }
  }
</script>

{#if player}
  {#if $api.isHost && !playerIsHost}
    <div class="modal {kickModal ? 'modal-open' : ''}">
      <div class="modal-box">
        <p>
          You want to kick {playerToKick?.name}? (BE CAREFUL)
        </p>
        <div class="modal-action">
          <label
            for="my-modal-5"
            on:click={() => {
              if (playerToKick) {
                api.game.kick(playerToKick.id);
              }
              // TODO: check if neccessary
              // $client.unsync = false;

              kickModal = false;
              playerToKick = undefined;
            }}
            class="btn btn-primary">kick</label
          >
          <label
            for="my-modal-5"
            class="btn"
            on:click={() => {
              kickModal = false;
            }}>Close</label
          >
        </div>
      </div>
    </div>
  {/if}
  {#if $api.isHost && !playerIsHost}
    <div class="modal {playerToHost ? 'modal-open' : ''}">
      <div class="modal-box">
        <p>
          You want to make {playerToHost.name} host? (BE CAREFUL)
        </p>
        <div class="modal-action">
          <label
            for="my-modal-5"
            on:click={() => {
              api.game.makeHost(playerToHost.id);
              //TODO: fix this
              // $client.unsync = false;
              playerToHost = false;
            }}
            class="btn btn-primary">make host</label
          >
          <label
            for="my-modal-5"
            class="btn"
            on:click={() => {
              playerToHost = false;
            }}>Close</label
          >
        </div>
      </div>
    </div>
  {/if}
  <div class="flex items-center flex-wrap space-y-2">
    <div
      class={`avatar ${player.online ? "online" : "offline"} placeholder mr-1`}
    >
      {#if !player.picture}
        <div
          class={`bg-neutral-focus text-neutral-content rounded-full ${
            small ? "w-6 h-6" : "w-12 h-12"
          }`}
        >
          <span class="text uppercase">{player.name.substring(0, 2)}</span>
        </div>
      {:else}
        <div class={`rounded-full ${small ? "w-6 h-6" : "w-12 h-12"}`}>
          <img src={player.picture} />
        </div>
      {/if}
    </div>
    <span class={` ${small ? "font-thin" : ""}  mr-1`}>{player.name}</span>
    {#if player.auth.emotes.length > 0}
      <div class="mx-1 h-6 max-w-12  inline">
        <Inventory ghost={true}
          ><img
            class="mx-1 max-h-6 max-w-12 "
            src={player.auth.emotes[player.auth.equiped]}
          /></Inventory
        >
      </div>
    {/if}
    {#if $api.game}
      {#if playerIsHost}
        <div class="badge badge-primary  mr-1">host</div>
      {/if}
    {/if}

    {#if $api.player.id === player.id}
      <div class="badge badge-secondary  mr-1">me</div>
    {/if}
    {#if !small}
      {#if player.twitch}
        <div class="badge badge-info  mr-1">twitch</div>
      {/if}
      {#each player.auth.badges as badge}
        <div class="badge  mr-1">{badge}</div>
      {/each}
    {/if}
    {#if $api.isHost && !playerIsHost}
      <div
        class="tooltip"
        data-tip="kick this player (he will not be able to rejoin this lobby)"
      >
        <button
          class="btn btn-xs btn-outline mr-1"
          on:click={() => {
            if (!playerIsHost) {
              playerToKick = player;
              kickModal = !kickModal;
            }
          }}
        >
          <UserMinusIcon size="1x" />
        </button>
      </div>

      <div class="tooltip" data-tip="makes this player host">
        <button
          class="btn btn-xs btn-outline"
          on:click={() => {
            if (!playerIsHost) {
              playerToHost = player;
            }
          }}
        >
          <ZapIcon size="1x" />
        </button>
      </div>
    {/if}
  </div>
{:else}
  player not found
{/if}
