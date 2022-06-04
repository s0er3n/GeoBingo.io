import { userNameGenerator, uuidv4 } from "../helpers/tools";

import {
  changeAuth,
  makeGuestToken,
  updateTokenAndAuth,
  verifyAndGetAuth,
} from "../helpers/tokenstuff";

import players from "../objects/PlayerHandler";

import { bounds, countryNames } from "../helpers/getAllCountries";

import { join } from "../helpers/twitch-chat";

import { streamerFrontPage } from "../helpers/variables";

import { MySocket } from "../types";

import createListner from "../helpers/createListner";

import {
  checkIfLobby,
  checkIfHost,
  checkCallback,
  checkIfPlayer,
} from "../helpers/checkers";

export default (io: any, socket: MySocket) => {
  const init = (token: string | undefined, callback: Function) => {
    if (!checkCallback(callback)) return;
    let guestToken;

    if (token) {
      socket.auth = verifyAndGetAuth(token);
    }
    if (!socket.auth) {
      const sub = uuidv4();
      const name = userNameGenerator();
      token = makeGuestToken(sub, name);
      socket.auth = verifyAndGetAuth(token); // can be optimized
      guestToken = token;
    }

    if (!socket.auth) {
      console.log("user not auth");
      return;
    }

    socket.player = players.getPlayerOrCreatePlayer(socket.auth);

    socket.player.addSocket(socket);

    if (checkIfLobby(socket)) {
      if (checkIfHost(socket)) {
        if (socket.player.auth?.provider === "twitch") {
          join(socket.player.auth.name, socket.player.lobby);
        }
      }
    }

    callback({
      guestToken: guestToken,
      streamerFrontPage,
      playerAndGame: socket.player.toObjWithLobby(),
      geometries: countryNames,
      bounds: bounds,
      time: Date.now().toString(),
    });
  };
  const changeName = (token: string, name: string, callback: Function) => {
    if (!checkCallback(callback)) return;
    if (typeof name !== "string") return;
    if (name.length < 3) return;

    if (!token) {
      console.log("no token provided");
      return;
    }
    if (!checkIfPlayer(socket)) {
      console.log("socket has no player object");
      return;
    }
    // you cannot change the name if you are authorized

    if (socket.player?.auth!.provider) {
      console.log("name change failed user is logged in with auth");
      return;
    }

    const newToken = updateTokenAndAuth(token, socket.player!, name);

    callback(newToken);

    socket.player?.updateSelf();
  };

  const authChange = (token: string) => {
    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }
    changeAuth(token, socket);
  };

  createListner(socket, "auth", [init, authChange, changeName]);
};
