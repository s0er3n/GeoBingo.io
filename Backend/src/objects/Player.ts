import { disconnect } from "../helpers/twitch-chat";
import { setStreamerFrontPage, streamerFrontPage } from "../helpers/variables";
import Auth from "./Auth";
import Game from "./Game";
import MMGame from "./MMGame";

import type { MySocket } from "../types";
import TGAH from "./GeoBingoAgainstHumanity";

export default class Player {
  lobby?: Game | TGAH | MMGame;
  online = false;
  sockets: MySocket[] = [];
  auth: Auth | undefined;
  get name() {
    if (!this.auth) return "";

    return this.auth.name;
  }

  get id() {
    if (!this.auth) return "";
    return this.auth.sub;
  }
  get sub() {
    if (!this.auth) return "";
    return this.auth.sub;
  }

  constructor(auth: Auth) {
    this.auth = auth;
  }

  getSub() {
    if (!this.auth) return "";
    return this.auth.sub;
  }

  addSocket(socket: MySocket) {
    this.sockets.push(socket);
    if (!this.online) {
      this.online = true;
      this.updateEveryoneInSameLobby();
    }
  }

  removeSocket(socket: MySocket) {
    this.sockets = this.sockets.filter((s) => s !== socket);
    if (this.sockets.length === 0) {
      this.online = false;
      if (this.name === streamerFrontPage) {
        setStreamerFrontPage("");
      }
      this.updateEveryoneInSameLobby();
      if (socket.player?.auth?.provider === "twitch") {
        disconnect(socket.player.name);
      }
    }
  }

  updateSelf = () => {
    if (!this.online) return;
    this.sockets.forEach((s) => {
      if (s.player) {
        s.emit("update", s.player.toObjWithLobby());
      }
    });
  };

  updateEveryoneInSameLobby() {
    this.lobby?.updateLobby();
  }

  toObj() {
    return {
      name: this.auth!.name,
      id: this.getSub(),
      twitch: this.auth!.provider === "twitch",
      online: this.online,
      picture: this.auth!.profilePicture,
      auth: this.auth!.toObj(),
    };
  }

  toObjWithLobby() {
    if (!this.lobby) {
      return [this.toObj(), undefined];
    }

    const res = this.toObj();

    const game = this.lobby.toGameState();

    return [res, game];
  }
}
