import { Pano } from "../types";
import BaseGame from "./BaseGame";
import Player from "./Player";

import { checkIfPanoIsReported } from "../helpers/api"
type Card = {
  text: string,
  pick: number
}

function getRandomCard() {
  return {
    text: `_  + _  = LUL`,
    pick: 2,
  }

}

type GamePhase = "lobby" | "voting" | "ingame" | "score"

type Reported = boolean
class CardAgainstHumanityCaptureStore {

  captures: { [key: number]: { pano: Pano, nsfw: Reported } } = {}
  player: Player
  constructor(pano: Pano, player: Player, pickIndex: number) {
    this.addCapture(pano, pickIndex)
    this.player = player
  }

  addCapture(pano: Pano, pickIndex: number) {
    console.log("adding picture add index", pickIndex)
    if (this.captures[pickIndex]) {
      delete this.captures[pickIndex]
      return
    }
    this.captures[pickIndex] = { pano, nsfw: false }
    checkIfPanoIsReported(pano.pano.pano, this.captures[pickIndex])
  }
  toObj() {
    return {
      captures: this.captures,
      player: this.player.toObj(),
    }
  }


}

type Votes = { [key: number]: Set<string> }

class Voting {
  captureStores: CardAgainstHumanityCaptureStore[] = []

  alreadyVoted: Set<string> = new Set()
  votes: Votes = {}

  constructor(captureStores: CardAgainstHumanityCaptureStore[]) {
    this.captureStores = captureStores
  }

  addVote(name: string | undefined, index: number) {
    if (typeof name !== "string") {
      console.log("no name no vote!")
      return
    }
    if (this.captureStores[index]) {
      if (this.captureStores[index].player.auth?.name === name) {
        console.log("probably same player")
        return
      }

    }
    if (this.alreadyVoted.has(name)) {
      // remove old vote
      for (const key in this.votes) {
        this.votes[key].delete(name)
      }
    }
    this.alreadyVoted.add(name)
    if (!this.votes[index]) {
      this.votes[index] = new Set()
    }
    this.votes[index].add(name)

  }

  createScore() {
    const score: { [key: string]: number } = {}

    for (const key in this.captureStores) {
      if (!this.captureStores[key]) continue

      const playerKeyAsJSONString = JSON.stringify(this.captureStores[key].player.toObj())
      const voteCount = this.votes[key]?.size ?? 0
      score[playerKeyAsJSONString] = voteCount
    }
    return Object.entries(score).sort(([_, voteCount]) => voteCount)

  }
  createScoreWithMap() {
    const score = new Map<Player, number>()
    for (const key in this.captureStores) {
      const player = this.captureStores[key].player
      const voteCount = this.votes[key]?.size ?? 0
      score.set(player, voteCount)
    }
    return score

  }

  toObj() {
    const voting: {
      [key: string]: string[]
    } = {}
    Object.entries(this.votes).forEach((entry) => {
      const [index, names] = entry
      if (typeof index === "string") { voting[index] = Array.from(names) }

    })
    return [voting, this.alreadyVoted.size]
  }




}

export default class TGAH extends BaseGame {


  captureIndex = 0
  host: Player
  country = "all"
  card: Card
  captures: CardAgainstHumanityCaptureStore[] = []
  gamePhase: GamePhase = "lobby"
  voting: Voting | undefined
  overallScore = new Map<Player, number>()

  constructor(host: Player, roomName: string, privateLobby: boolean) {
    super(roomName, privateLobby);
    this.host = host;
    this.players.add(host);
    this.card = getRandomCard()
  }

  //FIXME: validate captures 
  changeCountry(country: string) {
    this.country = country;
    this.updateLobby();
  }

  shuffleWord() {
    if (this.gamePhase !== "lobby") {
      console.log("not in lobby")
      return
    }
    this.card = getRandomCard()
    this.updateLobby()
  }

  changeCard(w: string) {
    if (this.gamePhase !== "lobby") {
      console.log("not in lobby")
      return
    }
    let cCounter = 0
    Array.from(w).forEach((c) => { if (c === "_") { cCounter++ } })
    this.card = { text: w, pick: cCounter }
    this.updateLobby()
  }

  makeCapture(pano: Pano, player: Player, pickIndex: number) {
    if (this.gamePhase !== "ingame") {
      console.log("not ingame")
      return
    }
    if (pickIndex < this.card.pick) {
      const store = this.captures.find(capture => capture.player === player)
      if (!store) {
        this.captures.push(new CardAgainstHumanityCaptureStore(pano, player, pickIndex))
      }
      else {
        store.addCapture(pano, pickIndex)
      }

    }
    this.updateLobby()
  }
  toGameState() {
    const [voting, totalVotes] = this.voting?.toObj() ?? [{}, 0]
    const state = {
      captureIndex: this.captureIndex,
      gameMode: "gah",
      gamePhase: this.gamePhase,
      time: this.time,
      gameEndTime: this.gameEndTime,
      card: this.card,
      title: this.title,
      size: this.size,
      privateLobby: this.privateLobby,
      onlyAuth: this.onlyAuth,
      country: this.country,
      captures: this.captures.map(capture => capture.toObj()),
      players: Array.from(this.players).map((player: Player) => player.toObj()),
      host: this.host.toObj(),
      score: this.voting?.createScore(),
      totalVotes,
      voting,
      overallScore: [...this.overallScore.entries()].map((playerAndScore) => [playerAndScore[0].toObj(), playerAndScore[1]]),
    }
    console.log(state)
    return state
  }

  setCaptureIndex(i: number) {
    if (i < 0 || i >= this.captures.length) return

    this.captureIndex = i;
    this.updateLobby()
  }

  start() {
    this.captureIndex = 0
    this.captures = []
    if (this.gamePhase !== "lobby") {
      console.log("not in lobby")
      return
    }
    this.gamePhase = "ingame"
    this.startGame(
      () => { if (this.gamePhase === "ingame") { this.end() } }
    )
    this.updateLobby()
  }

  end() {

    if (this.gamePhase !== "ingame") {
      console.log("not ingame")
      return
    }
    if (typeof this.currentScheduledJob !== "undefined") {
      this.currentScheduledJob.cancel()
      this.gameEndTime = undefined
    }

    this.captures = this.captures.filter(capture => Object.keys(capture.captures).length !== 0)
    if (this.captures.length === 0) {
      this.gamePhase = "lobby"
    }
    else {
      this.gamePhase = "voting"
      this.voting = new Voting(this.captures)
    }
    this.updateLobby()
  }

  reportPano(panoid: string) {
    console.log(panoid)
    this.captures.forEach(store => {
      Object.values(store.captures).forEach(capture => {
        console.log(capture.pano.pano.pano, panoid)
        if (capture.pano.pano.pano === panoid) {
          console.log("nsfw")
          capture.nsfw = true
        }
      })
    })
    this.updateLobby()
  }

  goToScore() {
    this.gamePhase = "score"
    this.updateLobby()
  }
  goToLobby() {
    this.gamePhase = "lobby"
    this.voting?.createScoreWithMap().forEach(
      (score, player) => {
        if (!this.overallScore.has(player)) {
          this.overallScore.set(player, score)
        } else {
          this.overallScore.set(player, this.overallScore.get(player)! + score)
        }
      }

    )


    this.updateLobby()
  }


}
