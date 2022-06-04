import Voting from "./Voting";
import { checkIfPanoIsReported } from "../helpers/api"
import Player from "./Player";
import { Pano } from "../types";
export default class Capture {
  pano: any
  player: Player
  word: number
  voting: Voting
  nsfw = false
  removed = false;
  extrapoint = false;
  time: number

  constructor(player: Player, pano: Pano, word: number, time: number) {
    this.time = time
    this.pano = pano;
    this.player = player;
    this.word = word;
    this.voting = new Voting();
    this.checkForNSFW()
  }
  checkForNSFW = () => {
    checkIfPanoIsReported(this.pano.pano.pano, this)
  }
  changeRemove(val: boolean) {
    this.removed = val;
  }
  switchExtraVoteCapture(val: boolean) {
    this.extrapoint = val;
  }
}
