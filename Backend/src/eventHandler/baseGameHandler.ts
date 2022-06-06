import createListner from "../helpers/createListner";
import type { MySocket } from "../types";
import {
  checkIfPlayer,
  checkIfHost,
  checkIfLobby,
  checkCallback,
} from "../helpers/checkers";
import players from "../objects/PlayerHandler";
import { makeRoomName } from "../helpers/tools";
import Game from "../objects/NormalGameModes/Game";
import { join as joinTwitchChat } from "../helpers/twitch-chat";
import {
  lobbies,
  setStreamerFrontPage,
  streamerWhiteList,
} from "../helpers/variables";
import GeoBingoAgainstHumanity from "../objects/GeoBingoAgainstHumanity/GeoBingoAgainstHumanity";
import MMGame from "../objects/NormalGameModes/MMGame";

let currentMMGame: MMGame;

export default (io: unknown, socket: MySocket) => {
  const changeSize = (size: string | number) => {
    if (typeof size === "string") {
      size = parseInt(size);
    }
    if (typeof size !== "number") return;

    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }

    if (!checkIfLobby(socket)) {
      console.log("lobby not found");
      return;
    }

    if (socket.player!.lobby!.host !== socket.player) {
      console.log("player has to be host to start game");
      return;
    }
    if (size > 100) {
      return;
    }

    socket.player!.lobby!.changeSize(size);
  };

  const changeTime = (time: string | number) => {
    if (typeof time === "string") {
      time = parseInt(time);
    }
    if (typeof time !== "number") return;

    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }

    if (!checkIfLobby(socket)) {
      console.log("lobby not found");
      return;
    }

    if (socket.player!.lobby!.host !== socket.player) {
      console.log("player has to be host to start game");
      return;
    }

    socket.player!.lobby!.changeTime(time);
  };

  const kick = (sub: string) => {
    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }

    if (!checkIfLobby(socket)) {
      console.log("player not in lobby");
      return;
    }

    if (!checkIfHost(socket)) {
      console.log("player not host ");
      return;
    }

    console.log("kick" + sub);
    try {
      players.getPlayerBySub(sub)?.sockets.forEach((s: MySocket) => {
        socket.player?.lobby?.banned_ips.add(s.handshake.address);
      });
    } catch (e) {
      console.log(e);

      return;
    }

    if (typeof socket.player?.lobby !== "undefined") {
      const player = players.getPlayerBySub(sub);
      if (player) {
        socket.player?.lobby?.kick(player);
      }
    }
  };

  const makeHost = (sub: string) => {
    if (typeof sub !== "string") return;

    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }

    if (!checkIfLobby(socket)) {
      console.log("player not in lobby");
      return;
    }

    if (!checkIfHost(socket)) {
      console.log("player not host ");
      return;
    }
    socket?.player?.lobby?.makeHost(sub);
  };

  const host = (
    privateLobby: boolean,
    gameType: "game" | "gah" | "MMGame" = "game",
    callback: Function
  ) => {
    const roomName: string = makeRoomName();

    if (typeof privateLobby !== "boolean") return;
    if (!checkCallback(callback)) return;

    if (!checkIfPlayer(socket)) {
      console.log("player object not found cannot host");
      return;
    }

    let game: Game | GeoBingoAgainstHumanity | MMGame;
    if (gameType === "game") {
      console.log("test");
      game = new Game(socket.player!, roomName, privateLobby);
    } else if (gameType === "gah") {
      game = new GeoBingoAgainstHumanity(
        socket.player!,
        roomName,
        privateLobby
      );
    } else if (gameType === "MMGame") {
      if (!currentMMGame) {
        game = new MMGame(socket.player!, roomName, privateLobby);
        currentMMGame = game;
      } else {
        game = currentMMGame;
      }
    } else {
      console.log("game type not implemented or wrong value");
      return;
    }

    lobbies[roomName] = game;

    socket.player.lobby = game;
    console.log(
      socket.player?.toObj(),

      socket.player?.lobby?.privateLobby,
      "is hosting",
      makeRoomName
    );
    callback(roomName);
  };
  const changeGameMode = (gameType: "game" | "gah" = "game") => {
    if (!checkIfPlayer(socket)) {
      console.log("player object not found cannot host");
      return;
    }

    if (!checkIfHost(socket)) return;
    const oldGame = socket.player.lobby;

    let newGame: Game | GeoBingoAgainstHumanity;

    if (gameType === "game") {
      console.log("test");
      newGame = new Game(socket.player!, oldGame.title, oldGame.privateLobby);
    } else if (gameType === "gah") {
      newGame = new GeoBingoAgainstHumanity(
        socket.player!,
        oldGame.title,
        oldGame.privateLobby
      );
    } else {
      console.log("game type not implemented or wrong value");
      return;
    }

    lobbies[oldGame.title] = newGame;

    for (const player of oldGame.players) {
      newGame.players.add(player);
      if (player.lobby === oldGame) {
        player.lobby = newGame;
      }
    }
    newGame.updateLobby();
  };

  const join = (lobby: string, callback: Function) => {
    console.log("join", "Lobby ", lobby, "Name:", socket?.player?.auth?.name);
    if (!checkCallback(callback)) return;

    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }

    if (!lobby) return;

    lobby = lobby.trim().toLowerCase();
    if (lobbies[lobby] === undefined) {
      console.log("room not found");
      callback("room not found");
      return;
    }

    if (socket.player) {
      if (lobbies[lobby].playersKicked.has(socket.player)) {
        console.log("player kicked");
        return;
      }
    }

    if (!socket.player) {
      return;
    }
    if (
      lobbies[lobby].players.size >= lobbies[lobby].size &&
      !lobbies[lobby].players.has(socket.player)
    ) {
      console.log("room full");
      callback("lobby full");
      return;
    }

    if (lobbies[lobby].onlyAuth) {
      if (!socket.player.auth!.provider) {
        callback("twitch only lobby");
        return;
      }
    }

    if (lobbies[lobby].banned_ips.has(socket.handshake.address)) {
      return;
    }

    socket.player.lobby = lobbies[lobby];

    lobbies[lobby].join(socket.player);

    if (checkIfHost(socket)) {
      if (
        socket.player.auth?.provider === "twitch" &&
        streamerWhiteList
          .map((streamer) => streamer.toLowerCase())
          .includes(socket.player.auth.name.toLowerCase())
      ) {
        setStreamerFrontPage(socket.player.auth.name);
      }

      if (socket.player.auth?.provider === "twitch") {
        joinTwitchChat(socket.player.auth.name, socket.player.lobby);
      }
    }

    callback("success");
  };

  const leave = (callback: Function) => {
    if (!checkCallback(callback)) return;

    if (!checkIfPlayer(socket)) {
      return;
    }
    // TODO either not show player if is not in lobby or delete player from lobby

    if (!socket.player?.lobby) {
      return;
    }
    // if (socket.player.lobby instanceof MMGame) {
    //   socket.player.lobby.players.delete(socket.player)
    // }
    socket.player.lobby = undefined;

    socket.player.updateSelf();
    callback("success");
  };

  const switchOnlyTwitch = (val: boolean) => {
    if (typeof val !== "boolean") return;
    if (!checkIfPlayer(socket)) {
      return;
    }

    if (!checkIfLobby(socket)) {
      return;
    }

    if (socket.player!.lobby!.host !== socket.player) {
      return;
    }

    socket.player!.lobby!.setOnlyTwitch(val);

    try {
      socket.player!.lobby!.updateLobby();
    } catch (e) {
      console.log("lobby does not exist anymore ");
    }
    return "success";
  };

  createListner(
    socket,
    ["normalGame", "gah", "MMGame"],
    [
      changeSize,
      changeTime,
      join,
      leave,
      switchOnlyTwitch,
      changeSize,
      host,
      makeHost,
      kick,
      changeGameMode,
    ]
  );
};
