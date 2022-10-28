<script>
  import DownloadButton from "$lib/components/DownloadButton.svelte";
  import Profile from "$lib/components/Profile.svelte";

  import Celebration from "$lib/components/Celebration.svelte";
  import Head from "$lib/components/Head.svelte";
  import { api } from "$lib/js/api";

  let score = $api.game.currentPhase.score;
  let oldScore = $api.game.currentPhase.oldScore;
  let sortedTotal = Object.values(score).sort((a, b) => b.points - a.points);
  console.log(score, oldScore);

  let sortedThisRound = Object.values(score).sort(
    (a, b) =>
      (oldScore[b.id] ? b.points - oldScore[b.id].points : b.points) -
      (oldScore[a.id] ? a.points - oldScore[a.id].points : a.points)
  );

  let sorted = sortedThisRound;

  $: isHost = $api.isHost;

  $: winnerRound = $api.game.currentPhase.players.find(
    (p) => p.id === sortedThisRound[0]?.id
  );
</script>

<div class="card min-h-full overflow-auto">
  <div class="card-body">
    <Head />
    <div class="overflow-x-auto">
      <table class="z-0 table w-full bg-base-100 rounded-md">
        <thead>
          <tr>
            <th class="cursor-pointer " on:click={() => (sorted = sortedTotal)}
              >Points</th
            >
            <th
              class="cursor-pointer"
              on:click={() => (sorted = sortedThisRound)}>Points this round</th
            >
            <th>Player</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {#each sorted as player}
            <tr>
              <td>{player.points}</td>
              <td>
                + {oldScore[player.id]
                  ? player.points - oldScore[player.id].points
                  : player.points}</td
              >
              <td>
                <div class="my-2">
                  {#if $api.game.currentPhase.players.find((p) => p.id === player.id)}
                    <Profile
                      player={$api.game.currentPhase.players.find(
                        (p) => p.id === player.id
                      )}
                    />
                  {:else}
                    player does not exist anymore
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <DownloadButton />
    <button
      disabled={!isHost}
      class="btn btn-warning mb-5"
      on:click={() => api.game.currentPhase.backToGameOver()}
      >Go back to captures</button
    >
    <button
      disabled={!isHost}
      class="btn btn-primary mb-5"
      on:click={() => api.game.currentPhase.goToLobby()}>go to lobby</button
    >
  </div>
</div>

{#if winnerRound?.auth?.emotes?.length > 0}
  <Celebration emote={winnerRound.auth.emotes[winnerRound.auth.equiped]} />
{/if}
