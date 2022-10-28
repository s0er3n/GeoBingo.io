import socket from "./socket";

import { user } from "./sessionStore.js";

import { supabase } from "./supabaseClient.js";
import { browser } from "$app/environment";

type Auth = {
  provider: string;
  badges: string[];
  emotes: string[];
  equiped: number;
};

export class Player {
  name: string;
  id: string;
  twitch: string;
  online: boolean;
  picture: string;
  auth: Auth;
  constructor(playerObj: any) {
    this.updateSelf(playerObj);
  }
  // TODO: put in helper folder
  getToken() {
    let session = supabase.auth.session();

    let token: string | undefined;

    if (supabase.auth.session()?.access_token) {
      if (browser) {
        token = session?.access_token;
      }
    } else {
      try {
        token = JSON.parse(localStorage.getItem("guestToken"))?.access_token;
      } catch (e) {
        console.log(e);
      }
    }
    return token;
  }

  get token() {
    return this.getToken();
  }

  updateSelf(playerObj: any) {
    this.name = playerObj.name;
    this.id = playerObj.id;
    this.twitch = playerObj.twitch;
    this.online = playerObj.online;
    this.picture = playerObj.picture;
    this.auth = playerObj.auth;
  }

  updateEquipedSkin(newVal: number) {
    socket.emit("player:updateEquipedSkin", newVal);
  }

  host(
    privateLobby: boolean = false,
    gameType: "gah" | "game" | "MMGame" = "game",
    lang: string
  ) {
    console.log(lang);
    socket.emit("normalGame:host", privateLobby, gameType, (response) => {
      console.log("hosting?");
      console.log(response);
      if (["en", "nl", "es", "de", "fr", "pt", "pl"].includes(lang)) {
        console.log("setting langauge to:", lang);
        socket.emit("normalGame:" + "changeLang", lang);
      }

      this.join(response);
    });
  }

  changeGameMode(gameType: "gah" | "game" | "MMGame" = "game") {
    socket.emit("normalGame:changeGameMode", gameType);
  }
  join(lobby: string) {
    socket.emit("normalGame:join", lobby, (response) => {
      if (response !== "success") {
        alert(response);
      }
    });
  }

  leave() {
    socket.emit("gah:leave", (response: string | undefined) => {
      console.log(response);
    });
  }

  changeName(name: string) {
    socket.emit("auth:changeName", this.token, name, (response: string) => {
      localStorage.setItem(
        "guestToken",
        JSON.stringify({
          access_token: response,
        })
      );
    });
  }

  removeTwitch() {
    socket.emit("auth:removeTwitch");
    user.set(false);
  }
  authChange(token: string | undefined = undefined) {
    if (!token) {
      let tokenObject = JSON.parse(localStorage.getItem("guestToken"));
      token = tokenObject?.access_token;
    }
    socket.emit("auth:authChange", token);
  }
  startGame() {
    socket.emit("baseGame:startGame");
  }
  clearSuggestions() {
    socket.emit("normalGame:clearSuggestions");
  }
}
