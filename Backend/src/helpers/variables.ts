import Game from "../objects/Game";
import MMGame from "../objects/MMGame";
import TGAH from "../objects/GeoBingoAgainstHumanity";
import { getStreamerWhiteList } from "./api";

export const gamePhases: { [key: string]: "lobby" | "ingame" | "gameover" | "score" } = {
  LOBBY: "lobby",
  INGAME: "ingame",
  GAMEOVER: "gameover",
  SCORE: "score",
};

export let streamerFrontPage = "";
export let setStreamerFrontPage = (streamer: string) => streamerFrontPage = streamer
export let streamerWhiteList: string[] = [];
export let updateWhiteList = async () => {
  let res = await getStreamerWhiteList()
  streamerWhiteList = res
}
type Lobbies = {
  [key: string]: Game | TGAH | MMGame
}

export const lobbies: Lobbies = {};

// clearing old lobbys every hour
setInterval(() => Object.entries(lobbies).forEach((obj) => {
  const [key, lobby] = obj
  const isEveryoneOffline = !([...lobby.players].filter(player => player.online && player.lobby === lobby).length);
  if (isEveryoneOffline) {
    console.log("deleting lobby")
    lobby.players.forEach((player) => { if (player.lobby === lobby) { player.lobby = undefined } })
    delete lobbies[key]
  }
}
), 3600 * 1000)

