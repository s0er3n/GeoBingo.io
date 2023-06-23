<script>
  import Profile from "./Profile.svelte";
  import { api } from "$lib/js/api";

  let score = {};
  function updateScore() {
    let newScore = {};
    if (!$api.game) {
      return;
    }
    if (!$api.game.currentPhase.captures) {
      return;
    }
    $api.game.currentPhase.captures.forEach((capture) => {
      if (!newScore[capture.player.id]) {
        newScore[capture.player.id] = { points: 0, player: capture.player };
      }
      newScore[capture.player.id].points += 1;
    });
    score = newScore;
  }
  $: $api.game ? $api.game.currentPhase.captures : "", updateScore();
  let switchControls = localStorage.getItem("switch");
</script>

{#if Object.keys(score).length !== 0}
  <div
    class={`absolute hidden md:flex pointer-events-none	  ${
      switchControls ? "left-0" : "right-0"
    }  z-20 h-full p-2 items-center`}
  >
    <div
      class=" pointer-events-auto max-h-96 overflow-auto card shadow-xl rounded-sm p-1 bg-base-100 hidden md:flex"
    >
      <ul>
        {#each Object.entries(score) as [player, score]}
          <li class="flex items-center m-1">
            <span class="font-thin text-center mx-1">{score.points}</span>
            <Profile small={true} player={score.player} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}
