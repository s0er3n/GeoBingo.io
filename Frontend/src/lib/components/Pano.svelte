<script>
  import {
    HeartIcon,
    XIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    AlertTriangleIcon,
  } from "svelte-feather-icons";

  let googleMapsApiKey = import.meta.env.VITE_GMAPSAPI;
  import { shortcut } from "$lib/js/shortcut.js";
  import { onDestroy } from "svelte";
  import Profile from "./Profile.svelte";
  import Timer, { currentTimer } from "./Timer.svelte";
  import Location from "$lib/components/Location.svelte";
  import { writable } from "svelte/store";
  import { api } from "$lib/js/api";
  let votingEnabled = true;
  let reason = "";
  let map = false;

  let ignoreBlur = {};

  let warning = true;

  let oldIndex = 0;

  const unsync = writable({ enabled: false, index: 0 });

  let unsub = api.subscribe((s) => {
    if (s.player) {
      if (s.game) {
        if (s.game.currentPhase.captures?.length - 1 < $unsync.index) {
          $unsync.index = $api.game.currentPhase.captureIndex;
        }
      }
      if (!$unsync.enabled) {
        if (s.game?.captureIndex !== oldIndex) {
          map = false;
        }
      }
      oldIndex = s.game?.captureIndex;
    }
  });

  let keepAndRemoveOnButtons = localStorage.getItem("keepAndRemove");

  $: newWord =
    captureIndex !== 0
      ? captures[captureIndex - 1].word !== capture.word
      : false;

  $: captures = $api.game.currentPhase.captures;

  const switchUnsyncOn = () => {
    $unsync.index = JSON.parse(
      JSON.stringify($api.game.currentPhase.captureIndex)
    );

    captureIndex = $unsync.index;
    $unsync.enabled = true;
    map = false;
  };

  const switchUnsyncOff = () => {
    $unsync.enabled = false;
    captureIndex = $api.game.currentPhaseString.captureIndex;
    map = false;
  };

  $: captureIndex = $unsync.enabled
    ? $unsync.index
    : $api.game.currentPhase.captureIndex;

  $: capture = $api.game.currentPhase.captures[captureIndex];

  $: playerAllowedToVote =
    $api.game.currentPhase.allowEveryoneToVote ||
    !$api.game.currentPhase.host.twitch ||
    ($api.game.currentPhase.host.twitch && $api.player.twitch);

  $: player = capture.player;

  $: isHost = $api.isHost;

  $: votesTotal =
    captures[captureIndex].voting.remove.length +
    captures[captureIndex].voting.keep.length;

  $: keepVoted =
    captures[captureIndex].voting.keep.length >
    captures[captureIndex].voting.remove.length;

  $: extraPointvote = captures[captureIndex].extrapoint;

  $: pano = capture.pano.pano;

  $: lastPano = captureIndex === captures.length - 1;

  let nsfwModal = false;

  $: votingPercentage =
    captures[captureIndex].voting.keep.length /
    (captures[captureIndex].voting.keep.length +
      captures[captureIndex].voting.remove.length)
      ? Math.floor(
          (captures[captureIndex].voting.keep.length /
            (captures[captureIndex].voting.keep.length +
              captures[captureIndex].voting.remove.length)) *
            100
        )
      : 0;

  onDestroy(() => {
    unsub();
  });

  const goBack = () => {
    if (isHost) {
      api.game.currentPhase.setCaptureIndex(captureIndex - 1);
      currentTimer.reset();
    } else {
      if (!$unsync.enabled) {
        switchUnsyncOn();
      }
      $unsync.index = $unsync.index - 1;
    }
    map = false;
  };

  const goNextAndMaybeRemoveOrKeep = (remove) => {
    if (isHost) {
      if (keepAndRemoveOnButtons) {
        api.game.currentPhase.removeCapture(remove, captureIndex);
      }
      if (captureIndex !== captures.length - 1) {
        api.game.currentPhase.setCaptureIndex(captureIndex + 1);
      } else {
        api.game.currentPhase.goToScore();
      }
      currentTimer.reset();
    } else {
      if (keepAndRemoveOnButtons) {
        api.game.currentPhase.vote(remove ? "remove" : "keep", captureIndex);
      }
      if (!$unsync.enabled) {
        switchUnsyncOn();
      }
      $unsync.index = $unsync.index + 1;
    }
    map = false;
  };
  let panoToReportIndex;
</script>

<div class="modal {nsfwModal ? 'modal-open' : ''}">
  <div class="modal-box">
    <p>Are you sure you want to report this image as NSFW?</p>
    <p>Abusing this feature may result in a global indefinite ban!</p>
    <input
      required
      type="text"
      bind:value={reason}
      placeholder="type your reasoning here"
      class="input mt-2 input-bordered w-full max-w-xs"
    />

    <div class="modal-action">
      <label
        for="my-modal-5"
        on:click={() => {
          if (reason.length > 3) {
            api.game.currentPhase.reportAsNSFW(panoToReportIndex, reason);
            reason = "";
            nsfwModal = false;
            panoToReportIndex = undefined;
          }
        }}
        class="btn btn-primary">report as nsfw</label
      >
      <label
        for="my-modal-5"
        class="btn"
        on:click={() => {
          nsfwModal = false;
          panoToReportIndex = undefined;
        }}>Close</label
      >
    </div>
  </div>
</div>

{#if !nsfwModal}
  <div class="h-full ">
    <div class="h-full card shadow bordered ">
      <div class="h-full overflow-auto bg-base-100 ">
        {#if !map}
          {#if warning && $api.player.twitch && isHost && !$api.game.currentPhase.onlyOfficialCoverage}
            <div class="p-20 content-center font-bold text-center">
              If you are streaming let someone go through the images beforehand
              in case there is some NSFW photospheres.

              <br />

              <button class="btn btn-error" on:click={() => (warning = false)}
                >i understand that
              </button>
            </div>
          {:else if !capture.removed}
            <div class="relative overflow-hidden w-full h-full">
              {#if capture.nsfw && !ignoreBlur[captureIndex]}<button
                  class="absolute rounded-none z-10 btn btn-error w-full"
                  on:click={() =>
                    (ignoreBlur[captureIndex] = !ignoreBlur[captureIndex])}
                  >️️<AlertTriangleIcon size="0.1x" /> WARNING SOMEONE MARKED THIS
                  AS NSFW!!! (click to show)<AlertTriangleIcon size="1x" />
                </button>{/if}
              <button
                class="absolute z-50 btn rounded-l-none btn top-16 left-0 h-18"
                on:click={() => (map = !map)}
              >
                show on map
              </button>
              <button
                class="absolute  btn-xs bottom-5 left-5 btn btn-info"
                on:click={() => {
                  document.getElementById("pano").src =
                    document.getElementById("pano").src;
                }}>reload panorama</button
              >
              {#if $api.player.twitch}
                <button
                  class="hidden absolute md:block  bottom-5 right-20 btn btn-xs btn-error"
                  on:click={() => {
                    panoToReportIndex = captureIndex;
                    nsfwModal = true;
                  }}
                >
                  report as nsfw
                </button>
              {/if}

              {#if isHost}
                <div
                  class="absolute pointer-events-none top-5 w-full flex justify-center "
                >
                  <Timer
                    callback={() => {
                      api.game.currentPhase.removeCapture(
                        !keepVoted,
                        captureIndex
                      );
                      if (captureIndex !== captures.length - 1) {
                        if (!$unsync.enabled) {
                          api.game.currentPhase.setCaptureIndex(
                            captureIndex + 1
                          );
                        } else {
                          $unsync.index = $unsync.index + 1;
                        }
                      } else {
                        api.game.currentPhase.goToScore();
                      }
                    }}
                  />
                </div>
              {/if}
              {#if !(capture.nsfw && !ignoreBlur[captureIndex])}
                <iframe
                  title="google maps"
                  id="pano"
                  frameborder="8"
                  style=""
                  height="100%"
                  width="100%"
                  src={`https://www.google.com/maps/embed/v1/streetview?pano=${
                    pano.pano
                  }&heading=${
                    pano.pov.heading <= 360 ? pano.pov.heading : 360
                  }&pitch=${pano.pov.pitch <= 90 ? pano.pov.pitch : 90}&fov=${
                    180 / Math.pow(2, pano.pov.zoom) <= 100
                      ? 180 / Math.pow(2, pano.pov.zoom)
                      : 100
                  }&key=${googleMapsApiKey}`}
                  allowfullscreen
                />
              {:else}
                <iframe
                  class="blur-xl "
                  title="google maps"
                  id="pano"
                  frameborder="8"
                  style=""
                  height="100%"
                  width="100%"
                  src={`https://www.google.com/maps/embed/v1/streetview?pano=${
                    pano.pano
                  }&heading=${
                    pano.pov.heading <= 360 ? pano.pov.heading : 360
                  }&pitch=${pano.pov.pitch <= 90 ? pano.pov.pitch : 90}&fov=${
                    180 / Math.pow(2, pano.pov.zoom) <= 100
                      ? 180 / Math.pow(2, pano.pov.zoom)
                      : 100
                  }&key=${googleMapsApiKey}`}
                  allowfullscreen
                />
              {/if}
            </div>
          {:else}
            <button
              class="btn btn-secondary"
              style={`height: 100%; width: 100%`}
              on:click={() =>
                api.game.currentPhase.removeCapture(
                  !captures[captureIndex].removed,
                  captureIndex
                )}
              >click to bring back removed panorama
            </button>
          {/if}
        {:else}
          <button
            class="absolute z-[1000] btn top-5 left-5"
            on:click={() => (map = !map)}
          >
            show pano
          </button>
          <Location
            lat={capture.pano.position.lat}
            long={capture.pano.position.long}
          />
        {/if}
      </div>
      <div class="p-4 w-full m-0 bg-base-100 ">
        <div class="flex flex-wrap items-center mb-0 pb-0">
          <div class="tooltip" data-tip={`time: ${capture.time}s`}>
            <span class="uppercase"
              >{$api.game.currentPhase.words[capture.word].word
                .charAt(0)
                .toUpperCase() +
                $api.game.currentPhase.words[capture.word].word.slice(1)}
              <span class="font-thin"
                >({captureIndex + 1}/{captures.length})</span
              ></span
            >
          </div>
          {#if votingEnabled}
            <div
              class="tooltip"
              data-tip={playerAllowedToVote
                ? "vote to keep the image"
                : "login or vote in twitch chat with !keep or !remove"}
            >
              <button
                use:shortcut={{ code: "KeyW" }}
                on:click={() => {
                  api.game.currentPhase.vote("keep", captureIndex);
                }}
                disabled={captures[captureIndex].voting.keep.includes(
                  $api.player.name.toLowerCase()
                ) || !playerAllowedToVote}
                class="btn btn-sm text-primary m-2   bg-base-100 btn-ghost"
                >️<HeartIcon size="1x" />
                <span class="font-thin">(w)</span></button
              >
            </div>
            <div
              class="tooltip"
              data-tip={playerAllowedToVote
                ? "vote to remove the image"
                : "login or vote in twitch chat with !keep or !remove"}
            >
              <button
                use:shortcut={{ code: "KeyS" }}
                disabled={captures[captureIndex].voting.remove.includes(
                  $api.player.name.toLowerCase()
                ) || !playerAllowedToVote}
                on:click={() =>
                  api.game.currentPhase.vote("remove", captureIndex)}
                class="btn btn-sm m-2   bg-base-100 btn-ghost"
                ><XIcon size="1x" /> <span class="font-thin">(s)</span></button
              >
            </div>

            <div>
              <div
                class={`radial-progress ${
                  votingPercentage > 50 ? "text-green-400" : "text-red-400"
                } text-sm m-2`}
                style={`--value:${votingPercentage}; --size:3rem; --thickness: 2px;`}
              >
                {votingPercentage}%
              </div>
              from {votesTotal} total votes
            </div>
          {/if}
        </div>
        <div class="flex flex-wrap center-items space-x-2 justify-between">
          {#if !$api.game.currentPhase.anonVoting}
            <div class="flex"><Profile {player} /></div>
          {/if}
        </div>
        <div class="flex  justify-around items-center">
          <div class="flex flex-wrap w-full items-center gap-2">
            <button
              use:shortcut={{ code: "KeyA" }}
              class="btn btn-sm  btn-secondary"
              disabled={captureIndex === 0}
              on:click={goBack}
              ><ArrowLeftIcon size="1x" /> go back
              <span class="font-thin">(a)</span>
            </button>

            {#if !isHost}
              <button
                disabled={!$unsync.enabled}
                class="btn btn-sm  btn-warning"
                on:click={() => switchUnsyncOff()}
              >
                sync with host</button
              >
            {/if}
            {#if keepAndRemoveOnButtons}
              <button
                disabled={!isHost && lastPano}
                use:shortcut={{ code: "KeyR" }}
                class="btn btn-sm  btn-warning"
                on:click={() => goNextAndMaybeRemoveOrKeep(true)}
                >{#if keepAndRemoveOnButtons}<XIcon
                    size="1x"
                  />{#if !isHost}vote
                  {/if} remove{/if}
                {#if captureIndex !== captures.length - 1}
                  and next <ArrowRightIcon size="1x" />
                {:else}
                  and go to score <ArrowRightIcon size="1x" />
                {/if}
                <span class="font-thin">(r)</span></button
              >
            {/if}
            <div
              class="tooltip z-50"
              data-tip="goes to the next image (the player will get the point if the image is not removed)"
            >
              <button
                use:shortcut={{ code: "KeyD" }}
                disabled={!isHost && lastPano}
                class="btn btn-sm  btn-info"
                on:click={() => goNextAndMaybeRemoveOrKeep(false)}
                >{#if keepAndRemoveOnButtons}<HeartIcon size="1x" />
                  {#if !isHost}vote {/if}keep and
                {/if}
                {lastPano ? "go to score" : "next"}
                <ArrowRightIcon size="1x" />
                <span class="font-thin">(d)</span>
              </button>
            </div>
            {#if isHost}
              <div
                class="tooltip"
                data-tip="accepts the voting from the other players (if the voting is 50% or less it will get removed)"
              >
                <button
                  use:shortcut={{ code: "Space" }}
                  disabled={!isHost || !votesTotal}
                  on:click={() => {
                    currentTimer.reset();
                    console.log(captureIndex);
                    api.game.currentPhase.removeCapture(
                      !keepVoted,
                      captureIndex
                    );
                    if (captureIndex !== captures.length - 1) {
                      if (!$unsync.enabled) {
                        api.game.currentPhase.setCaptureIndex(captureIndex + 1);
                      } else {
                        $unsync.index = $unsync.index + 1;
                      }
                    } else {
                      api.game.currentPhase.goToScore();
                    }
                    map = false;
                  }}
                  class={`btn btn-sm m-2 btn-primary ${
                    votingPercentage > 50 ? "bg-green-400" : "bg-red-400"
                  }  `}
                  >{#if !keepVoted}
                    <XIcon class="mr-1" size="1x" />
                  {:else}
                    <HeartIcon class="mr-1" size="1x" />
                  {/if}
                  accept voting {#if captureIndex !== captures.length - 1}
                    <ArrowRightIcon size="1x" />
                  {:else}
                    and go to score
                    <ArrowRightIcon size="1x" />
                  {/if}
                  <span class="font-thin">(space)</span>
                </button>
              </div>
            {/if}
            <div class=" p-0 m-0 rounded-xl inline-flex bordered">
              <div
                class="tooltip"
                data-tip="if enabled the player gets 1 more point at the end"
              >
                <div
                  on:click={() =>
                    api.game.currentPhase.switchExtraVoteCapture(
                      !extraPointvote,
                      captureIndex
                    )}
                  class="form-control p-0 m-0"
                >
                  <label class="cursor-pointer label m-0 ">
                    <span class="text-sm  m-0 mr-2"
                      >+1 EXTRA POINT <span class="font-thin">(F)</span></span
                    >
                    <input
                      use:shortcut={{ code: "KeyF" }}
                      type="checkbox"
                      disabled={!isHost}
                      checked={captures[captureIndex].extrapoint}
                      class="toggle m-0 p-0 "
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden w-fit  lg:flex gap-2  p-0 justify-self-end">
            {#if playerAllowedToVote}
              <div
                class="tooltip"
                data-tip={$api.isHost
                  ? "you will be able to overwrite the voting of the other players"
                  : "you can vote keep or remove while going through the images"}
              >
                <div
                  on:click={() => {
                    localStorage.getItem("keepAndRemove")
                      ? localStorage.removeItem("keepAndRemove")
                      : localStorage.setItem("keepAndRemove", "1");
                    keepAndRemoveOnButtons =
                      localStorage.getItem("keepAndRemove");
                  }}
                  checked={localStorage.getItem("keepAndRemove")}
                  class="form-control p-0 m-0"
                >
                  <label class="cursor-pointer label m-0 ">
                    <span class=" text-xs  m-0 mr-2 ">
                      {#if !isHost}vote with remove and keep{:else}overwrite
                        voting{/if}
                    </span>
                    <input
                      type="checkbox"
                      checked={keepAndRemoveOnButtons}
                      class="toggle toggle-xs m-0 p-0 "
                    />
                  </label>
                </div>
              </div>
            {/if}
            {#if isHost}
              <div
                class="tooltip tooltip-left"
                data-tip="don't show the player profile while voting"
              >
                <div
                  on:click={() =>
                    api.game.currentPhase.switchAnonVoting(
                      !$api.game.currentPhase.anonVoting
                    )}
                  class="form-control p-0 m-0"
                >
                  <label class="cursor-pointer label m-0 ">
                    <span class="text-xs  m-0 mr-2 "> anonymous voting </span>
                    <input
                      type="checkbox"
                      checked={$api.game.currentPhase.anonVoting}
                      class="toggle toggle-xs m-0 p-0 "
                    />
                  </label>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
