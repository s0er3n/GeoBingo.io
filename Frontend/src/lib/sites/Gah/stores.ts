import { writable, type Writable } from "svelte/store"

export const gahSentences: Writable<Array<{
  sentence: string;
  picks?: number;
}>> = writable([])
