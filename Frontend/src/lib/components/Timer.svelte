<script context="module">
  import { shortcut } from "$lib/js/shortcut.js";
  import Timer from "$lib/js/timer.js";
  import { onDestroy } from "svelte";
  export const currentTimer = new Timer(() => {}, 15);
</script>

<script>
  export let callback;

  currentTimer.callback = callback;

  currentTimer.init();

  onDestroy(() => {
    console.log("timer destroyed");
    currentTimer.destroy();
  });
  let mouseInterval;
</script>

<div
  class="hidden pointer-events-auto md:flex m-0"
  on:mouseup={() => {
    clearInterval(mouseInterval);
    mouseInterval = undefined;
  }}
>
  <div>
    <div
      class="tooltip tooltip-bottom"
      data-tip="will accept the voting in {$currentTimer.remaining}s  and go next (it will pause automatically if you use a movement button)"
    >
      <button
        use:shortcut={{ code: "Enter" }}
        on:click={() => currentTimer.startPause()}
        class={$currentTimer.isRunning
          ? "btn btn-xs btn-primary "
          : "btn btn-xs btn-secondary"}
        >{$currentTimer.isRunning ? "" : "enable"} auto accept voting in {$currentTimer.remaining}s
        (enter)</button
      >
    </div>
    <button
      class="btn btn-xs btn-primary"
      on:mousedown={() => {
        mouseInterval = setInterval(() => {
          currentTimer.plus();
        }, 100);
      }}
      on:click={() => {
        currentTimer.plus();
      }}
    >
      +
    </button>
    <button
      class="btn btn-xs btn-warning"
      on:click={() => currentTimer.reset()}
    >
      reset
    </button>
    <button
      class="btn btn-xs btn-primary"
      on:mousedown={() => {
        mouseInterval = setInterval(() => {
          currentTimer.minus();
        }, 100);
      }}
      on:click={() => {
        currentTimer.minus();
      }}
    >
      -
    </button>
  </div>
</div>
