<script lang="ts">
  import { supabase } from "$lib/js/supabaseClient";

  let getPhotospheres = async () =>
    await supabase.from("savedPanos").select("*").eq("playerid", api.player.id);
  import { ArchiveIcon } from "svelte-feather-icons";
  import { api } from "$lib/js/api";

  export let ghost = false;
</script>

{#if $api.player.twitch}
  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="my-modal-5" class="modal-toggle" />
  <label for="my-modal-5" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h1>Your Inventory (click to choose)</h1>
      <div class="grid grid-cols-9 content-center">
        {#if api?.player?.twitch}
          {#await getPhotospheres() then data}
            <div class="overflow-x-auto overflow-scroll">
              <table class="bg-base-100 table w-full">
                <thead>
                  <tr>
                    <td />
                    <td>description</td>
                    <td>link</td>
                  </tr>
                </thead>
                <tbody>
                  {#each data.data as row, i}
                    <tr>
                      <td>{i + 1}</td>
                      <td>{row.tags}</td>
                      <td><a href={row.link}>{row.link}</a></td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/await}
        {:else}
          you are not logged in
        {/if}
      </div>
    </label>
  </label>
{/if}
{#if !ghost}
  {#if $api.player.twitch}
    <label for="my-modal-5" class="m-2 btn btn-info modal-button "
      >Saved Locatoins<ArchiveIcon size="1x" class="ml-2" />
    </label>
  {/if}
{:else}
  <label disabled={!api.player.twitch} for="my-modal-5"><slot /></label>
{/if}
