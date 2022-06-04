import { gamePhases } from "../helpers/variables";
import Score from "./Score"
import Capture from "./Capture"; import schedule from "node-schedule"; import { getRandomWords, getRandomWordNotInWordList } from "../helpers/words"
import { checkLatLangPointisInCountry } from "../helpers/countryValidator";
import _ from "lodash"
import Player from "./Player";
import { Pano } from "../types";
import BaseGame from "./BaseGame";

type Word = {
  word: string
  tags: string[]
}

type SuggestedWord = {
  word: string
  playerName: string
}
export default class Game extends BaseGame {
  captureIndex = 0
  captures: Capture[] = [];
  words: Word[] = [];
  size = 100
  suggestedWords: SuggestedWord[] = []
  country = "all";
  score = new Score();
  host: Player;
  wordsDisabled = false;
  onlyOfficialCoverage = false;
  allowEveryoneToVote = true
  public = false;
  anonVoting = false
  gamePhase = gamePhases.LOBBY;
  constructor(host: Player, roomName: string, privateLobby: boolean) {
    super(roomName, privateLobby);
    this.host = host;
    this.players.add(host);
    this.words = getRandomWords(5);
  }


  newRandomWord(i: number) {
    const newWord = getRandomWordNotInWordList(this.words)
    this.words[i] = newWord;
    this.updateLobby();
  }
  newRandomWords(lockedWords: number[]) {

    for (let index = 0; index < this.words.length; index++) {
      if (!lockedWords.includes(index)) {
        this.words[index] = getRandomWordNotInWordList(this.words)
      }
    }
    this.updateLobby();
  }
  changeWord(newWord: string, i: number) {
    if (newWord !== undefined) {
      this.words[i] = { word: newWord, tags: ["english"] };
      this.updateLobby();
    }
  }
  deleteWord(i: number) {
    this.words.splice(i, 1);
    this.updateLobby();
  }
  addWordToGame() {
    const newWord = getRandomWordNotInWordList(this.words)
    this.words.push(newWord);
    this.updateLobby();
  }
  kick(player: Player) {
    player.lobby = undefined;
    this.playersKicked.add(player);
    // new index
    let newIndex =
      this.captures
        .slice(0, this.captureIndex)
        .filter((capture) => !(capture.player === player)).length - 1;
    if (newIndex === -1) {
      newIndex = 0
    }

    this.captures = this.captures.filter(
      (capture) => !(capture.player === player)
    );

    this.captureIndex = newIndex
    if (this.gamePhase === gamePhases.GAMEOVER) {
      this.goToGameOver(newIndex);
    }
    this.players.delete(player);
    this.updateLobby();
  }
  isHostOnline() {
    if (!this.host) return false
    return this.host.online;
  }
  checkPanoIsValidCountry(pano: Pano) {
    if (this.country === "all") {
      return true;
    }

    const res = checkLatLangPointisInCountry(this.country, pano.position.long, pano.position.lat)
    return res;
  }

  clearSuggestions() {
    this.suggestedWords = []
    this.updateLobby()
  }

  addCapture(player: Player, pano: Pano, i: number) {

    const time = Math.floor((Date.now() - (this.gameEndTime!.getTime() - this.time * 60000)) / 1000)

    if (this.gamePhase !== gamePhases.INGAME) {
      return "fail";
    }
    if (!this.checkPanoIsValidCountry(pano)) {
      return "fail";
    }
    // filtering out if capture already there
    // FIXME: what is going on here
    const filtered = this.captures.filter(
      (capture) => !(capture.word === i && capture.player === player)
    );
    if (
      this.captures.length === filtered.length &&
      this.captures.every((value, index) => value === filtered[index])
    ) {
      this.captures.push(new Capture(player, pano, i, time));
    } else {
      this.captures = filtered;
    }
    this.updateLobby();
    return "success";
  }
  startGame() {
    const newGameEndTime = new Date(Date.now() + this.time * 60000);
    this.gameEndTime = newGameEndTime;
    schedule.scheduleJob(newGameEndTime, () => {
      if (this.gamePhase !== "ingame") {
        console.log("not ingame");
        return;
      }
      if (this.gameEndTime !== newGameEndTime) {
        console.log("not ending game there is already a new game");
        return;
      } else {
        this.goToGameOver();
        this.updateLobby();
      }
    });
    this.gamePhase = gamePhases.INGAME;
    this.updateLobby();
  }
  goToLobby() {
    this.gamePhase = gamePhases.LOBBY;
    this.captures = [];
    this.updateLobby();
  }
  goToGameOver(captureIndex = 0) {
    this.captureIndex = captureIndex;
    console.log(captureIndex)
    if (this.captures.length === 0) {
      this.goToLobby();
    } else {
      this.captures = this.captures.sort((a, b) => Number(a.word) - Number(b.word));
      this.gamePhase = gamePhases.GAMEOVER;
    }
    this.updateLobby();
  }
  setCaptureIndex(newVal: number) {
    this.captureIndex = newVal;
    this.updateLobby();
  }

  addCustomWordToGame(newWord: string) {

    newWord.split(";").forEach(word => { if (word.length <= 100 && this.words.length <= 200) { this.words.push({ word, tags: [] }) } })
    this.updateLobby()
  }
  goToScore() {
    if (this.gamePhase === gamePhases.SCORE) { console.log("already in score"); return }
    this.score.captures = [...this.captures]

    this.gamePhase = gamePhases.SCORE;
    this.updateLobby();
  }
  goBackToGameOver() {
    this.score.revert([...this.captures])
    this.gamePhase = gamePhases.GAMEOVER;
    this.updateLobby();
  }

  vote(vote: string, name: string, index: number | undefined) {
    if (!index) {
      index = this.captureIndex;
    }
    if (!this.captures[index]) {
      console.log("cannot vote on the image bc it doesnt exists")
    }
    try {
      this.captures[index].voting.addVote(vote, name);
    } catch (e) {
      console.log(e)
    }
    this.updateLobby();
  }

  isKicked(player: Player) {
    return this.playersKicked.has(player);
  }

  changeCountry(country: string) {
    this.country = country;
    this.updateLobby();
  }

  getPlayersAsASortedArray() {
    return Array.from(this.players)
      .map((player) => player.toObj())
      .sort((a, b) => Number(b.online) - Number(a.online))
  }

  getCapturesAsObjectsForIngame() {
    return this.captures.map((capture) => {
      return {
        word: capture.word,
        player: capture.player.toObj(),
      };
    })
  }

  getCapturesAsObjectsForGameOver() {
    return this.captures
      .map((capture) => {
        return {
          voting: capture.voting.toObj(),
          removed: capture.removed,
          extrapoint: capture.extrapoint,
          pano: capture.pano,
          word: capture.word,
          nsfw: capture.nsfw,
          player: capture.player.toObj(),
          time: capture.time
        };
      })
      .sort((a, b) => Number(a.word) - Number(b.word))
  }

  getCapturesAsObjectsForScore() {
    return this.captures
      .map((capture) => {
        return {
          removed: capture.removed,
          extrapoint: capture.extrapoint,
          pano: capture.pano,
          word: capture.word,
          player: capture.player.toObj(),
        };
      })
      .sort((a, b) => Number(a.word) - Number(b.word))
  }

  toGameState() {
    type State = {
      gameMode: "NormalGame"
      gamePhase: "lobby" | "ingame" | "gameover" | "score",
      host: ReturnType<Player["toObj"]>,
      players?: ReturnType<Player["toObj"]>[]
      time?: number,
      size?: number,
      allowEveryoneToVote?: boolean
      words: Word[],
      privateLobby?: boolean,
      anonVoting?: boolean,
      onlyAuth?: boolean,
      onlyOfficialCoverage?: boolean,
      title?: string,
      suggestedWords?: { word: string, playerName: string }[],
      country?: string
      captureIndex?: number
      gameEndTime?: string
      captures?: any[]
      score?: ReturnType<Score["new"]>
      oldScore?: ReturnType<Score["old"]>
    };

    let state: State
    switch (this.gamePhase) {
      case gamePhases.LOBBY:
        state = {
          gameMode: "NormalGame",
          score: this.score.new(),
          allowEveryoneToVote: this.allowEveryoneToVote,
          gamePhase: this.gamePhase,
          host: this.host.toObj(),
          players: this.getPlayersAsASortedArray(),
          time: this.time,
          size: this.size,
          words: this.words,
          anonVoting: this.anonVoting,
          privateLobby: this.privateLobby,
          onlyAuth: this.onlyAuth,
          onlyOfficialCoverage: this.onlyOfficialCoverage,
          title: this.title,
          suggestedWords: this.suggestedWords,
          country: this.country,
        };
        return state;
      case gamePhases.INGAME:
        state = {
          gameMode: "NormalGame",
          gamePhase: this.gamePhase,
          host: this.host.toObj(),
          time: this.time,
          gameEndTime: this.gameEndTime?.toString(),
          title: this.title,
          onlyOfficialCoverage: this.onlyOfficialCoverage,
          words: this.words,
          country: this.country,
          captures: this.getCapturesAsObjectsForIngame()
        };
        return state;
      case gamePhases.GAMEOVER:
        state = {
          gameMode: "NormalGame",
          host: this.host.toObj(),
          gamePhase: this.gamePhase,
          allowEveryoneToVote: this.allowEveryoneToVote,
          words: this.words,
          captureIndex: this.captureIndex,
          title: this.title,
          anonVoting: this.anonVoting,
          captures: this.getCapturesAsObjectsForGameOver(),
        };
        return state;
      case gamePhases.SCORE:
        state = {
          gameMode: "NormalGame",
          captures: this.getCapturesAsObjectsForScore(),
          words: this.words,
          players: this.getPlayersAsASortedArray(),
          host: this.host.toObj(),
          gamePhase: this.gamePhase,
          score: this.score.new(),
          title: this.title,
          oldScore: this.score.old(),
        };
        return state;
    }
  }
  addWordSuggestion(words: string, playerName: string) {
    words.split(";").forEach(word => word !== '' && word.length <= 100 && this.suggestedWords.length <= 200 ? this.suggestedWords.push({ word, playerName }) : undefined)
    this.updateLobby()
  }
  removeWordSuggestion(removeWord: string) {
    this.suggestedWords = this.suggestedWords.filter((word) => word.word !== removeWord)
    this.updateLobby()
  }

  addWordSuggestionToWords(newWord: string) {
    this.suggestedWords = this.suggestedWords.filter((word) => word.word !== newWord)
    this.addCustomWordToGame(newWord)
    // no update lobby bc addCustomWord already calls it

  }

}
