<script lang="ts">
  let donation = false;
  import { HeartIcon } from "svelte-feather-icons";
</script>

{#if !donation || localStorage.getItem("noDonate")}
  <slot />
{:else}
  <div class="h-full w-screen flex content-center justify-center p-5">
    <div class="card w-96 bg-base-100 shadow-xl">
      <iframe
        id="kofiframe"
        src="https://ko-fi.com/soerenmichaels/?hidefeed=true&widget=true&embed=true&preview=true"
        class="w-full h-full bg-base-100"
        title="soerenmichaels"
      />
      <div class="card-body">
        <h2 class="card-title text-sm">
          If you like the site and you can afford it consider donating :)
        </h2>
        <p class="text-xs">
          I want to keep improving the site and give you the best experience
          <span class="font-bold">WITHOUT</span> ads or pro accounts with a
          monthly fee. Everyone should have fun on my site <HeartIcon
            class="inline"
            size="1x"
          />
        </p>
        <div class="card-actions flex justify-between">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text m-2">don't show again</span>
              <input
                type="checkbox"
                on:click={() =>
                  localStorage.getItem("noDonate")
                    ? localStorage.removeItem("noDonate")
                    : localStorage.setItem("noDonate", "1")}
                checked={localStorage.getItem("noDonate") === "1"}
                class="checkbox"
              />
            </label>
          </div>
          <button on:click={() => (donation = false)} class="btn btn-primary"
            >go to lobby</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
