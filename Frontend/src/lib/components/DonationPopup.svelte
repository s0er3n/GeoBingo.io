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
        <h2 class="card-title text-xs">Help me keep the site alive.</h2>
        <p class="text-xs">
          Since the recent rise in users, I cannot justify paying for the Google
          Maps API on my own anymore and I will have to put the site offline if
          the usage keeps being this high. Please consider donating on <a
            class="text-blue-400"
            href="https://ko-fi.com/soerenmichaels">Ko-fi.com/soerenmichaels</a
          >. <br /><br /> Have fun playing, <br /> Sören
        </p>
        <div class="card-actions flex justify-between">
          <button on:click={() => (donation = false)} class="btn btn-primary"
            >go to lobby</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
