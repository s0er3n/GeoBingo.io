import { writable, type Writable } from "svelte/store";

export class WritableClass {
  set: Writable<typeof this>["set"];
  subscribe: Writable<typeof this>["subscribe"];
  update: Writable<typeof this>["update"];

  makeThisWritable() {
    const P = writable(this);
    const { set, subscribe, update } = P;

    this.set = set;
    this.update = update;
    this.subscribe = subscribe;
  }

  refresh = () => {
    this.set(this);
  };

  constructor() {
    this.makeThisWritable();
  }
}
