<script>
  import { browser } from "$app/environment";
  import NameChange from "$lib/components/NameChange.svelte";
  import SignIn from "$lib/components/SignIn.svelte";
  import { api } from "$lib/js/api";

  let lobbyToJoin = "";
  let code = "";
  const setRoom = () => {
    if (browser) {
      let url = new URL(window.location.href);
      code = url.searchParams.get("code");

      console.log("code", code);
      if (code) {
        lobbyToJoin = code;
      }
    }
  };

  let privateLobby = false;
  setRoom();
</script>

<div class="w-3/4">
  <ul class="p-4 grid w-full space-y-4 shadow-lg bg-base-100 rounded-box">
    <li class="flex justify-center w-full">
      <span> login or choose username </span>
    </li>
    <div class="w-full">
      <li class="flex justify-center w-full">
        <SignIn bind:code />
      </li>
    </div>
    {#if !$api.player.twitch}
      <li class="bordered w-full">
        <NameChange />
      </li>
    {/if}
    <li class="relative">
      <input
        type="text"
        placeholder="Code"
        bind:value={lobbyToJoin}
        class="w-full select-auto input input-primary input-bordered"
      />
      <button
        on:click={() => api.player.join(lobbyToJoin)}
        class="absolute  top-0 right-0 rounded-l-none btn btn-primary font-bold text-xl"
        >join</button
      >
    </li>
    <li>
      <label class="cursor-pointer label">
        <span class="label-text">hide link to game</span>
        <input
          type="checkbox"
          on:click={() => (privateLobby = !privateLobby)}
          checked={privateLobby}
          class="toggle"
        />
      </label>
    </li>
    <div>
      <li class="">
        <button
          on:click={() => {
            if (api.player) {
              console.log(navigator.language || navigator.userLanguage);
              const lang = (navigator.language || navigator.userLanguage).slice(
                0,
                2
              );
              // maybe get languages from backend in the future
              console.log(lang);
              $api.player.host(privateLobby, "game", lang);
            }
          }}
          class="btn btn-primary w-full"
        >
          Play with friends/chat
        </button>
      </li>
    </div>
    <div class="indicator w-full">
      <li class="w-full">
        <span class="indicator-item badge badge-info">BETA</span>
        <button
          on:click={() => {
            if (api.player) {
              $api.player.host(privateLobby, "MMGame");
            }
          }}
          class="btn btn-secondary w-full h-fit"
        >
          join public game
        </button>
      </li>
    </div>
    <div class="indicator w-full">
      <li class="">
        <span class="indicator-item badge badge-info">BETA</span>
        <button
          on:click={() => {
            if (api.player) {
              $api.player.host(privateLobby, "gah");
            }
          }}
          class="btn btn-secondary w-full h-fit p-2"
        >
          Create GeoBingo Against Humanity Game (not affilated with Cards
          Against Humanity)</button
        >
      </li>
    </div>
  </ul>
</div>
