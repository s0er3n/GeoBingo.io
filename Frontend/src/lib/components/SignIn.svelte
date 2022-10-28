<script>
  import { user } from "$lib/js/sessionStore.js";
  import { supabase } from "$lib/js/supabaseClient";
  import Auth from "$lib/components/Auth.svelte";
  import Profile from "$lib/components/Profile.svelte";
  import { api } from "$lib/js/api";
  export let code;

  supabase?.auth?.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      if (session.access_token) {
        api.player.authChange(session.access_token);
      }
    }
    if (event === "TOKEN_REFRESHED") {
      if (session.access_token) {
        api.player.authChange(session.access_token);
      }
    }
  });
  async function signout() {
    // user.set(false);
    /* client.removeTwitch(); */
    const { error } = await supabase.auth.signOut();
    if (!error) {
      api.player.authChange();
    }
  }
</script>

{#if $api.player.twitch}
  <div class="card bordered p-2">
    <Profile player={api.player} />
    <div class="p-2 flex w-full justify-center ">
      <button class="btn btn-xs btn-error" on:click={() => signout()}
        >Logout</button
      >
    </div>
  </div>
{:else if supabase}
  <Auth {code} />
{/if}
