<script>
  import { onDestroy } from "svelte";
  export let events;
  export let disabled;
  let i = 0;
  // let interval = setInterval(() => {
  //   i =  (i === events.length - 1?   0: i+1)
  //   console.log(i)
  //   if (!disabled){
  //   window.location.replace ( window.location.href.split("#")[0] + "#" + i)
  //   }
  // }, 3000);

  // onDestroy(
  //   () => clearInterval(interval)
  // )
</script>

<div class="p-2 w-full">
  <div class="">
    <div class="w-full h-full carousel ">
      {#each events as event, i}
        <div id={i} class="w-full carousel-item flex justify-center">
          <a href={event.link} class="" target="_blank">
            <img src={event.image} class="rounded-md " />
          </a>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex justify-center w-full py-2 gap-2">
    {#if events.length > 1}
      {#each events as event, i}
        <a
          href={`#${i}`}
          on:click={() => clearInterval(interval)}
          class="btn btn-xs">{i + 1}</a
        >
      {/each}
    {/if}
  </div>
</div>
