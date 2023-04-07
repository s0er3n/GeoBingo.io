import socket from "./socket";
import type Game from "../../../../Backend/src/objects/NormalGameModes/Game";
import { supabase } from "./supabaseClient.js";

type GamePhases = Lobby | Ingame | Score | VotingPhase;

type GamePhaseString = "lobby" | "ingame" | "score" | "votingphase";
// make Type
type gameStateFn = Game["toGameState"];
type GameObj = ReturnType<gameStateFn>;

export class NormalGame {
  settings = new Settings();
  currentPhase: GamePhases;
  gameMode = "NormalGame";
  currentPhaseString: GamePhaseString;

  // moved it here bc it makes more sense

  constructor(gameObj: GameObj) {
    this.updateGamePhase(gameObj);
  }

  makeHost(playerId: string) {
    socket.emit("normalGame:" + "makeHost", playerId);
  }

  updateOrCreateGamePhase(gameObj: GameObj, typeOfPhase: any) {
    if (this.currentPhase instanceof typeOfPhase) {
      this.currentPhase.update(gameObj);
    } else {
      this.currentPhase = new typeOfPhase(gameObj);
    }
  }

  kick(playerId: string) {
    socket.emit("normalGame:" + "kick", playerId);
  }

  updateGamePhase(gameObj: GameObj) {
    switch (gameObj.gamePhase) {
      case "lobby": {
        this.currentPhaseString = gameObj.gamePhase;
        this.updateOrCreateGamePhase(gameObj, Lobby);
        break;
      }
      case "ingame": {
        this.currentPhaseString = gameObj.gamePhase;
        this.updateOrCreateGamePhase(gameObj, Ingame);
        break;
      }
      case "score": {
        this.currentPhaseString = gameObj.gamePhase;
        this.updateOrCreateGamePhase(gameObj, Score);
        break;
      }
      case "gameover": {
        this.currentPhaseString = "votingphase";
        this.updateOrCreateGamePhase(gameObj, VotingPhase);
        break;
      }
    }
  }
}

type GamePhase = {
  update(gameObj: GameObj): void;
};

export class Lobby implements GamePhase {
  host: GameObj["host"];
  players: GameObj["players"];
  time: GameObj["time"];
  size: GameObj["size"];
  words: GameObj["words"];
  anonVoting: GameObj["anonVoting"];
  privateLobby: GameObj["privateLobby"];
  onlyAuth: GameObj["onlyAuth"];
  onlyOfficialCoverage: GameObj["onlyOfficialCoverage"];
  title: GameObj["title"];
  suggestedWords: GameObj["suggestedWords"];
  restriction: GameObj["restriction"];
  score: GameObj["score"];

  constructor(gameObj: GameObj) {
    this.update(gameObj);
  }

  startGame() {
    socket.emit("normalGame:" + "startGame");
  }

  update(gameObj: GameObj): void {
    if (gameObj.gamePhase !== "lobby") {
      throw "update with wrong gameObj in lobby";
    }
    for (const [key, value] of Object.entries(gameObj)) {
      this[key] = value;
    }
  }

  addWords(word: string) {
    location.reload();
    socket.emit("normalGame:" + "addWords", word);
  }

  reportWord(word: string) {
    socket.emit("normalGame:" + "reportWord", word);
  }

  newRandomWord(i: number) {
    socket.emit("normalGame:" + "newRandomWord", i);
  }
  newRandomWords(lockedWords: number[]) {
    socket.emit("normalGame:" + "newRandomWords", lockedWords);
  }
  changeWord(newWord: string[], i: number) {
    socket.emit("normalGame:" + "changeWord", newWord, i);
  }

  deleteWord(i: number) {
    socket.emit("normalGame:" + "deleteWord", i);
  }
  addWord() {
    socket.emit("normalGame:" + "addWordToGame");
  }

  clearSuggestions() {
    socket.emit("normalGame:" + "clearSuggestions");
  }
  addCustomWord(customWord: string, database: boolean) {
    socket.emit("normalGame:" + "addCustomWordToGame", customWord, database);
  }
  addWordToDB(customWord: string) {
    socket.emit("normalGame:" + "addWordToDB", customWord);
  }
  addSuggestedWord(suggestedWord: string) {
    socket.emit("normalGame:" + "addSuggestWord", suggestedWord);
  }
  removeWordSuggestion(removedWord: string) {
    socket.emit("normalGame:" + "removeWordSuggestion", removedWord);
  }
  addWordSuggestionToWords(newWord: string) {
    socket.emit("normalGame:" + "addWordSuggestionToWords", newWord);
  }
}

export class Ingame implements GamePhase {
  host: GameObj["host"];
  time: GameObj["time"];
  gameEndTime: GameObj["gameEndTime"];
  title: GameObj["title"];
  onlyOfficialCoverage: GameObj["onlyOfficialCoverage"];
  words: GameObj["words"];
  restriction: GameObj["restriction"];
  captures: GameObj["captures"];

  constructor(gameObj: GameObj) {
    this.update(gameObj);
  }

  update(gameObj: GameObj): void {
    if (gameObj.gamePhase !== "ingame") {
      throw "update with wrong gameObj in ingame";
    }
    for (const [key, value] of Object.entries(gameObj)) {
      this[key] = value;
    }
  }
  addCapture(i: number, pano: any) {
    socket.emit(
      "normalGame:" + "addCapture",
      i,
      pano,
      (response: string | undefined) => {
        console.log(response);
      }
    );
  }

  endGame() {
    socket.emit("normalGame:" + "endGame", (response: string | undefined) =>
      console.log(response)
    );
  }
}

class Score implements GamePhase {
  captures: GameObj["captures"];
  words: GameObj["words"];
  players: GameObj["players"];
  host: GameObj["host"];
  gamePhase: GameObj["gamePhase"];
  score: GameObj["score"];
  title: GameObj["title"];
  oldScore: GameObj["oldScore"];

  constructor(gameObj: GameObj) {
    this.update(gameObj);
  }

  update(gameObj: GameObj): void {
    if (gameObj.gamePhase !== "score") {
      throw "update with wrong gameObj in ingame";
    }
    for (const [key, value] of Object.entries(gameObj)) {
      this[key] = value;
    }
  }

  goToLobby() {
    socket.emit("normalGame:" + "lobby", (response: string | undefined) =>
      console.log(response)
    );
  }

  backToGameOver() {
    socket.emit(
      "normalGame:" + "backToGameOver",
      (response: string | undefined) => console.log(response)
    );
  }
}

class Settings {
  switchAllowEveryoneToVote(val: boolean) {
    socket.emit("normalGame:" + "switchAllowEveryoneToVote", val);
  }
  switchOnlyOfficialCoverage(val: boolean) {
    socket.emit("normalGame:" + "switchOnlyOfficialCoverage", val);
  }
  switchOnlyTwitch(val: boolean) {
    socket.emit("normalGame:" + "switchOnlyTwitch", val);
  }
  changeTime(time: number) {
    socket.emit("normalGame:" + "changeTime", time);
  }
  changeSize(size: number) {
    socket.emit("normalGame:" + "changeSize", size);
  }
  changeRestriction(data: {
    key: string;
    val: string;
    lat: string;
    lng: string;
  }) {
    socket.emit("normalGame:" + "changeRestriction", data);
  }
  changeLang(lang: string) {
    socket.emit("normalGame:" + "changeLang", lang);
  }
  switchAnonVoting(val: boolean) {
    socket.emit("normalGame:" + "switchAnonVoting", val);
  }
}
class VotingPhase implements GamePhase {
  host: GameObj["host"];
  gamePhase: GameObj["gamePhase"];
  words: GameObj["words"];
  captureIndex: GameObj["captureIndex"];
  title: GameObj["title"];
  anonVoting: GameObj["anonVoting"];
  captures: GameObj["captures"];
  allowEveryoneToVote: GameObj["allowEveryoneToVote"];

  constructor(gameObj: GameObj) {
    this.update(gameObj);
  }

  setCaptureIndex(newVal: number) {
    socket.emit("normalGame:" + "setCaptureIndex", newVal);
  }
  update(gameObj: GameObj): void {
    if (gameObj.gamePhase !== "gameover") {
      throw "update with wrong gameObj in VotingPhase";
    }
    for (const [key, value] of Object.entries(gameObj)) {
      this[key] = value;
    }
  }

  switchExtraVoteCapture(i: string, val: boolean) {
    socket.emit("normalGame:" + "switchExtraVoteCapture", i, val);
  }

  saveReportedPanosInDB = async (
    i: number,
    reason: string,
    playerId: string
  ) => {
    try {
      let { data, error } = await supabase.from("reportedPhotospheres").insert({
        panoid: this.captures[i].pano.pano.pano,
        reason,
        playerid: playerId,
      });
      console.log(data, error);
    } catch (e) {
      console.log(e);
    }
  };
  savePano = async (
    i: number,
    tags: string,
    playerId: string
  ) => {
    try {
      let { data, error } = await supabase.from("savedPanos").insert({
        panoid: this.captures[i].pano.pano.pano,
        tags,
        playerid: playerId,
      });
      console.log(data, error);
    } catch (e) {
      console.log(e);
    }
  };


  async reportAsNSFW(i: number, reason: string, playerId: string) {
    // maybe i should consider doing this on server site
    // someone could write random stuff in the table

    try {
      await this.saveReportedPanosInDB(i, reason, playerId);
    } catch (e) {
      console.log(e);
    }

    socket.emit("normalGame:" + "reportAsNSFW", i, reason);
  }
  removeCapture(i: number, val: boolean) {
    socket.emit("normalGame:" + "remove", i, val);
  }
  goToScore() {
    socket.emit("normalGame:" + "score", (response: string) =>
      console.log(response)
    );
  }
  vote(vote: string, index: number) {
    socket.emit("normalGame:" + "vote", vote, index);
  }
}
