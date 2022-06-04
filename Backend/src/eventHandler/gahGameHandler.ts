import createListner from "../helpers/createListner";
import type { MySocket, Pano } from "../types";
import {
  checkIfPlayer,
  checkIfHost,
  checkIfLobby,
  checkCallback,
  isGeoBingoAgainstHumanity,
} from "../helpers/checkers";
import { panoSchema } from "../zodTypes";
const getGAH = (socket: MySocket, hostOnly = false) => {
  if (!socket?.player) return;
  if (isGeoBingoAgainstHumanity(socket.player?.lobby)) {
    const lobby = socket.player?.lobby;
    const isHost = lobby?.host === socket?.player;

    if (hostOnly && !isHost) return;

    return lobby;
  }
};

export default (io: unknown, socket: MySocket) => {
  const vote = (index: number) => {
    console.log("voting", index, socket?.player?.auth?.name);
    const game = getGAH(socket);
    game?.voting?.addVote(socket?.player?.auth?.name, index);
    //updating lobby bc we are acessing voting directly //TODO: improve this
    game?.updateLobby();
  };

  const report = (panoid: string) => {
    getGAH(socket)?.reportPano(panoid);
  };
  const makeHost = (playerId: string) => {
    getGAH(socket, true)?.makeHost(playerId);
  };

  const setCaptureIndex = (index: number) => {
    getGAH(socket, true)?.setCaptureIndex(index);
  };

  const endGame = () => {
    getGAH(socket, true)?.end();
  };

  const newRandomCard = () => {
    getGAH(socket, true)?.shuffleWord();
  };
  const changeCard = (w: string) => {
    console.log(w);
    getGAH(socket, true)?.changeCard(w);
  };

  const makeCapture = (i: number, pano: any) => {
    getGAH(socket, false)?.makeCapture(pano, socket.player!, i);
  };

  const start = () => {
    getGAH(socket, true)?.start();
  };
  const score = () => {
    getGAH(socket, true)?.goToScore();
  };
  const changeCountry = (country: string) => {
    if (typeof country !== "string") return;

    getGAH(socket, true)?.changeCountry(country);
  };

  const goToLobby = () => {
    getGAH(socket, true)?.goToLobby();
  };
  createListner(socket, "gah", [
    makeHost,
    newRandomCard,
    start,
    makeCapture,
    vote,
    score,
    endGame,
    setCaptureIndex,
    goToLobby,
    changeCountry,
    changeCard,
    report,
  ]);
};
