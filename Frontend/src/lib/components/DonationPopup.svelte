<script lang="ts">
  let donation = true;
  import { HeartIcon } from "svelte-feather-icons";
</script>

{#if !donation}
  <slot />
{:else}
  <div class="h-full w-screen h-screen flex content-center justify-center p-5">
    <div class="card w-96 bg-base-100 shadow-xl">
      <iframe
        id="kofiframe"
        src="https://ko-fi.com/soerenmichaels/?hidefeed=true&widget=true&embed=true&preview=true"
        class="w-full h-full bg-base-100"
        title="soerenmichaels"
      />
      <div class="card-body">
        <div class="card-actions flex justify-between">
          <button on:click={() => (donation = false)} class="btn btn-primary"
            >go to lobby</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
