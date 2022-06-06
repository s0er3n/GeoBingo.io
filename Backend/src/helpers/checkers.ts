import { Socket } from "socket.io";
import { MySocket } from "../types";
import Player from "../objects/Player";
import Game from "../objects/Game";
import GeoBingoAgainstHumanityGame from "../objects/GeoBingoAgainstHumanity";

export const checkIfPlayer = (
  socket: MySocket
): socket is Socket & { player: Player } => (socket.player ? true : false);

export const checkIfHost = (
  socket: MySocket
): socket is Socket & { player: Player & { lobby: Game | GeoBingoAgainstHumanityGame } } =>
  socket.player?.lobby?.host === socket.player;

export const checkCallback = (callback: any): callback is Function =>
  typeof callback === "function";

export const checkIfLobby = (
  socket: MySocket
): socket is Socket & { player: Player & { lobby: Game | GeoBingoAgainstHumanityGame } } =>
  typeof socket?.player?.lobby !== "undefined";

export const isGame = (game: Game | any): game is Game => {
  return typeof game?.words !== "undefined" ? true : false;
};
export const isGeoBingoAgainstHumanity = (game: GeoBingoAgainstHumanityGame | any): game is GeoBingoAgainstHumanityGame => {
  const res = typeof game?.card !== undefined ? true : false;
  if (!res) {
    console.log("wrong game type");
  }
  return res;
};
