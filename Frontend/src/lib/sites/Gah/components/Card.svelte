<script lang="ts">
  import { api } from "$lib/js/api";
  import { Lobby } from "$lib/js/GeoBingoAgainstHumanity";
  import { gahSentences } from "../stores";
  import {
    PlusIcon,
    ShuffleIcon,
    UploadIcon,
    FileIcon,
  } from "svelte-feather-icons";
  import CustomWordModal from "./CustomWordModal.svelte";
  import { supabase } from "$lib/js/supabaseClient";
  getSentencesFromSupabase();
  let files: FileList;
  let warning = false;

  function filterOutMoreThanOneBlankAfterEachOther(sentence: String) {
    let res = "";
    for (let i = 0; i < sentence.length; i++) {
      if (i >= 300) return res;
      if (sentence[i - 1] === "_" && sentence[i] === "_") {
        continue;
      }
      res += sentence[i];
    }
    return res;
  }

  $: lobby =
    $api.game.currentPhase instanceof Lobby
      ? $api.game.currentPhase
      : undefined;

  const readFile: () => Promise<
    Array<{
      sentence: string;
      picks: number;
    }>
  > = async () => {
    if (!files?.length) {
      console.log("no files");
      return [];
    }
    console.log("storeing  sentences");
    const text = await files[0].text();
    const textArray = text.split("\n");

    const res: {
      sentence: string;
      picks: number;
    }[] = [];

    textArray.forEach((sentence: string) => {
      let cCounter: number = 0;
      Array.from(sentence).forEach((c) => {
        if (c === "_") {
          cCounter++;
        }
      });
      sentence = sentence.replace("\\n", "");
      if (cCounter) {
        res.push({ sentence, picks: cCounter });
      }
    });

    console.log(res);
    return res;
  };

  async function storeSentences() {
    let store = await readFile();
    if (store.length) {
      gahSentences.set(store);
    }
  }

  let oldVal;
  function randomSentence() {
    const randomSentenceValue =
      $gahSentences[Math.floor(Math.random() * $gahSentences.length)].sentence;

    if (oldVal === randomSentenceValue) {
      return randomSentence();
    } else {
      oldVal = randomSentenceValue;
      return randomSentenceValue;
    }
  }

  // modal
  let open = false;
  let value = "";

  async function insertSentenceInDB(sentence: string) {
    const { data, error } = await supabase
      .from("sentences")
      .insert([{ sentence }]);
  }
  async function getSentencesFromSupabase() {
    if (!api.isHost) return;
    let { data: sentences, error } = await supabase
      .from("sentences")
      .select("sentence")
      .eq("approved", true);

    if (!error) {
      gahSentences.set(sentences);
      lobby.changeCard(randomSentence());
    }
  }
</script>

<div class="p-5">
  <div class="border-0 rounded-md bg-base-100 shadow-md">
    <div class="p-5 flex w-full justify-center items-center">
      <span class="text-3xl xl:text-6xl w-full h-fit text-center"
        >{lobby?.card?.text}</span
      >
      <div class="p-2 flex flex-cols justify-center items-center space-x-2">
        {#if $api.isHost}
          <button
            on:click={async () => {
              await storeSentences();
              if (!$gahSentences.length) {
                lobby.newRandomCard();
              } else {
                lobby.changeCard(randomSentence());
              }
            }}
            class="btn btn-primary"><ShuffleIcon size="1.5x" /></button
          >

          <CustomWordModal
            title={"Add custom sentence (use _ for gaps)"}
            callback={() => {
              console.log("modal closed");
              if (!value.includes("_")) {
                warning = true;
                return;
              }
              insertSentenceInDB(value);
              lobby.changeCard(value);
              value = "";
              open = false;
            }}
            bind:open
            closeText={"add"}
          >
            {#if warning}
              <span class="text-red-400 font-bold"
                >You need to add atleast one _</span
              >
            {/if}
            <input
              type="text"
              on:input={(e) => {
                e.target.value = filterOutMoreThanOneBlankAfterEachOther(
                  e.target.value
                );
              }}
              bind:value
              placeholder="type here _ <- gap"
              class="input input-bordered input-primary w-full max-w-xs"
            />
            <p class="py-2">
              the sentence will be stored on the server and maybe added to the
              game
            </p>
          </CustomWordModal>

          <button
            on:click={() => {
              open = true;
            }}
            class="btn btn-primary"
          >
            <PlusIcon size="1.5x" />
          </button>
          <label
            class={`btn  ${files ? "btn-success" : "btn-secondary"}`}
            for="file"
          >
            {#if !files}
              <UploadIcon size="1.5x" />
            {:else}
              <FileIcon size="1.5x" />
            {/if}
          </label>
          <input
            bind:files
            accept=".txt"
            type="file"
            id="file"
            style="display:none;"
          />
        {/if}
      </div>
    </div>
  </div>
</div>
