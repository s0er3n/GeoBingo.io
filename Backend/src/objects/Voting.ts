export default class Voting {
  keep = new Set<string>();
  remove = new Set<string>();

  addVote(vote: string, name: string) {
    if (this.keep.size + this.remove.size < 500) {
      name = name.toLowerCase();
      if (vote === "keep") {
        console.log("keep");
        this.remove.delete(name);
        this.keep.add(name);
      } else if (vote === "remove") {
        console.log("remove");
        this.keep.delete(name);
        this.remove.add(name);
      } else {
        console.log("vote not right!");
      }
    }
  }
  toObj() {
    return {
      keep: Array.from(this.keep),
      remove: Array.from(this.remove),
    };
  }
}
