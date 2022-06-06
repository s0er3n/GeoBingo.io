import { gamePhases } from "../../helpers/variables";
import Score from "./Score";
import Capture from "./Capture";
import schedule from "node-schedule";
import { getRandomWords, getRandomWordNotInWordList } from "../../helpers/words";
import { checkLatLangPointisInCountry } from "../../helpers/countryValidator";
import _ from "lodash";
import Player from "../Player";
import { Pano } from "../../types";
import BaseGame from "../BaseGame";

type Word = {
  word: string;
  tags: string[];
};

export default class Game extends BaseGame {
  captureIndex = 0;
  captures: Capture[] = [];
  words: Word[] = [];
  size = 1000;
  country = "all";
  score = new Score();
  wordsDisabled = false;
  onlyOfficialCoverage = false;
  allowEveryoneToVote = true;
  public = false;
  anonVoting = false;
  gamePhase = gamePhases.LOBBY;
  constructor(host: Player, roomName: string, privateLobby: boolean) {
    super(roomName, privateLobby);
    this.players.add(host);
    this.time = 10;
    // after timer or players joined
    this.waitingForPlayers();
    this.words = getRandomWords(5);
  }

  waitingForPlayers = () => {
    let online = 0;
    this.players.forEach((player) => {
      if (player.online && player.lobby === this) {
        online += 1;
      }
    });
    if (online === 2) {
      this.startGame();
      return;
    }
    setTimeout(this.waitingForPlayers, 5000);
  };

  newRandomWords(lockedWords: number[]) {
    for (let index = 0; index < this.words.length; index++) {
      if (!lockedWords.includes(index)) {
        this.words[index] = getRandomWordNotInWordList(this.words);
      }
    }
    this.updateLobby();
  }

  checkPanoIsValidCountry(pano: Pano) {
    if (this.country === "all") {
      return true;
    }

    const res = checkLatLangPointisInCountry(
      this.country,
      pano.position.long,
      pano.position.lat
    );
    return res;
  }

  addCapture(player: Player, pano: Pano, i: number) {
    const time = Math.floor(
      (Date.now() - (this.gameEndTime!.getTime() - this.time * 60000)) / 1000
    );

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
  startGame = () => {
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
  };

  goToLobby = () => {
    this.gamePhase = gamePhases.LOBBY;
    this.captures = [];
    this.newRandomWords([]);
    this.updateLobby();
    setTimeout(this.waitingForPlayers, 60000);
  };
  goToGameOver = (captureIndex = 0) => {
    this.captureIndex = captureIndex;
    console.log(captureIndex);
    if (this.captures.length === 0) {
      this.goToLobby();
    } else {
      this.captures = this.captures.sort(
        (a, b) => Number(a.word) - Number(b.word)
      );
      this.gamePhase = gamePhases.GAMEOVER;
      setTimeout(this.goThroughCaptures, 12000);
    }
    this.updateLobby();
  };

  goThroughCaptures = () => {
    //TODO: add remove logic
    const votesForKeep = this.captures[this.captureIndex].voting.keep.size;
    const votesForRemove = this.captures[this.captureIndex].voting.remove.size;
    const totalVotes = votesForKeep + votesForRemove;
    if (totalVotes) {
      if (votesForKeep / totalVotes <= 0.5) {
        this.captures[this.captureIndex].removed = true;
      }
    }

    if (this.captureIndex === this.captures.length - 1) {
      setTimeout(this.goToScore, 12000);
      return;
    }

    this.captureIndex += 1;
    this.updateLobby();
    setTimeout(this.goThroughCaptures, 12000);
  };

  setCaptureIndex(newVal: number) {
    this.captureIndex = newVal;
    this.updateLobby();
  }

  addCustomWordToGame(newWord: string) {
    newWord.split(";").forEach((word) => {
      if (word.length <= 100 && this.words.length <= 200) {
        this.words.push({ word, tags: [] });
      }
    });
    this.updateLobby();
  }
  goToScore = () => {
    if (this.gamePhase === gamePhases.SCORE) {
      console.log("already in score");
      return;
    }
    console.log(this.score, this.captures);

    this.score.captures = [...this.captures];

    this.gamePhase = gamePhases.SCORE;

    this.updateLobby();

    setTimeout(this.goToLobby, 15000);
  };
  goBackToGameOver() {
    this.score.revert([...this.captures]);
    this.gamePhase = gamePhases.GAMEOVER;
    this.updateLobby();
  }

  vote(vote: string, name: string, index: number | undefined) {
    if (!index) {
      index = this.captureIndex;
    }
    if (!this.captures[index]) {
      console.log("cannot vote on the image bc it doesnt exists");
    }
    try {
      this.captures[index].voting.addVote(vote, name);
    } catch (e) {
      console.log(e);
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
      .sort((a, b) => Number(b.online) - Number(a.online))
      .filter((player) => player.online && player.lobby === this)
      .map((player) => player.toObj());
  }

  getCapturesAsObjectsForIngame() {
    return this.captures.map((capture) => {
      return {
        word: capture.word,
        player: capture.player.toObj(),
      };
    });
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
          time: capture.time,
        };
      })
      .sort((a, b) => Number(a.word) - Number(b.word));
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
      .sort((a, b) => Number(a.word) - Number(b.word));
  }

  toGameState() {
    type State = {
      gameMode: "MMGame";
      gamePhase: "lobby" | "ingame" | "gameover" | "score";
      // host: ReturnType<Player["toObj"]>,
      players?: ReturnType<Player["toObj"]>[];
      time?: number;
      size?: number;
      allowEveryoneToVote?: boolean;
      words: Word[];
      privateLobby?: boolean;
      anonVoting?: boolean;
      onlyAuth?: boolean;
      onlyOfficialCoverage?: boolean;
      title?: string;
      country?: string;
      captureIndex?: number;
      gameEndTime?: string;
      captures?: any[];
      score?: ReturnType<Score["new"]>;
      oldScore?: ReturnType<Score["old"]>;
    };

    let state: State;
    switch (this.gamePhase) {
      case gamePhases.LOBBY:
        state = {
          gameMode: "MMGame",
          score: this.score.new(),
          allowEveryoneToVote: this.allowEveryoneToVote,
          gamePhase: this.gamePhase,
          // host: this.host.toObj(),
          players: this.getPlayersAsASortedArray(),
          time: this.time,
          size: this.size,
          words: this.words,
          anonVoting: this.anonVoting,
          privateLobby: this.privateLobby,
          onlyAuth: this.onlyAuth,
          onlyOfficialCoverage: this.onlyOfficialCoverage,
          title: this.title,
          country: this.country,
        };
        return state;
      case gamePhases.INGAME:
        state = {
          gameMode: "MMGame",
          gamePhase: this.gamePhase,
          // host: this.host.toObj(),
          time: this.time,
          gameEndTime: this.gameEndTime?.toString(),
          title: this.title,
          onlyOfficialCoverage: this.onlyOfficialCoverage,
          words: this.words,
          country: this.country,
          captures: this.getCapturesAsObjectsForIngame(),
        };
        return state;
      case gamePhases.GAMEOVER:
        state = {
          gameMode: "MMGame",
          // host: this.host.toObj(),
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
          gameMode: "MMGame",
          captures: this.getCapturesAsObjectsForScore(),
          words: this.words,
          players: this.getPlayersAsASortedArray().filter(
            (player) => player.online
          ),
          gamePhase: this.gamePhase,
          score: this.score.new(),
          title: this.title,
          oldScore: this.score.old(),
        };
        return state;
    }
  }
}
