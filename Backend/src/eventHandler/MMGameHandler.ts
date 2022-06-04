

import createListner from "../helpers/createListner"
import type { MySocket, Pano } from "../types"
import { checkIfPlayer, checkIfHost, checkIfLobby, checkCallback, isGame } from "../helpers/checkers"
import { addWordToDB as addWordToDBAPI, reportWord as reportWordApi } from "../helpers/api";

export default (io: unknown, socket: MySocket) => {

  const addCapture = (i: number, pano: Pano, callback: Function) => {

    if (typeof i !== "number") return
    if (!checkCallback(callback)) return
    if (!pano) return

    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      callback("fail", "player not found");
      return;
    }

    if (!checkIfLobby(socket)) {
      console.log("player not in lobby no need to update");
      callback("fail", "not in lobby");
      return;
    }
    if (!isGame(socket.player!.lobby)) {
      return
    }

    let res
    if (socket.player) {
      res = socket.player!.lobby!.addCapture(socket.player, pano, i);
      socket.player!.updateEveryoneInSameLobby();
      callback(res);
    }
  };


  const reportAsNSFW = (i: number, reason: string) => {
    

    if (typeof i !== "number") return

    if (!checkIfPlayer(socket)) {
      return;
    }

    if (!checkIfLobby(socket)) {
      return;
    }
    if (!isGame(socket.player!.lobby)) {
      return
    }

    if (!reason) {
      console.log("no reason")
      return
    }

    // saveReportedPanosInDB(socket.player.lobby.captures[i].pano.pano.pano, reason, socket.player)

    socket.player!.lobby!.captures[i].nsfw = true

    socket.player!.updateEveryoneInSameLobby()
  };
  const reportWord = async (word: string) => {
    if (typeof word !== "string") return

    if (!checkIfPlayer(socket)) {
      return;
    }

    if (!checkIfLobby(socket)) {
      return;
    }
    if (socket.player!.lobby!.host !== socket.player) {
      return;
    }
    await reportWordApi(word)
  };
  createListner(socket, "MMGame", [addCapture, reportWord, reportAsNSFW])

}
