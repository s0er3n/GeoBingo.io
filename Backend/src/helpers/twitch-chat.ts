import tmi from "tmi.js";
import Game from "../objects/NormalGameModes/Game";
import GeoBingoAgainstHumanityGame from "../objects/GeoBingoAgainstHumanity/GeoBingoAgainstHumanity";
import { isGame } from "./checkers";


dotEnv.config({ path: "../.env" })
import dotEnv from "dotenv";
const client = new tmi.Client({
  identity: {
    username: process.env.name, password: process.env.token,
  },
});

// u have to wait for client connect before you can join channel
try {
  (async () => {
    await client.connect();
  })();
} catch (e) {
  console.log(e);
}

const lobbies: { [key: string]: Game | GeoBingoAgainstHumanityGame } = {};

client.on("message", (channel, tags, message, self) => {
  if (self || !message.startsWith("!")) return;

  const args = message.slice(1).split(" ");
  const command = args.shift()!.toLowerCase();
  const game = lobbies[channel];
  if (isGame(game)) {
    if (command === "remove") {
      console.log("remove");
      try {
        game?.vote("remove", tags.username!, undefined);
      } catch (e) {
        console.log(e);
      }
    }
    if (command === "keep" || command === "accept") {
      console.log("keep");
      try {
        game.vote("keep", tags.username!, undefined);
      } catch (e) {
        console.log(e);
      }
    }
    if (command === "suggest") {
      console.log("keep");
      try {
        game.addWordSuggestion(args.join(" "), tags.username!);
      } catch (e) {
        console.log(e);
      }
    }
  }
  if (!lobbies[channel].privateLobby) {
    if (command === "bongo"  || command === "bingo"  || command === "join" || command === "link") {
      try {
        client.say(
          channel,
          `🤖 you can join here: ${process.env.domain}/?code=` + game.title
        );
      } catch (e) { }
    }
    if (command === "code") {
      try {
        client.say(
          channel,
          "🤖 you can join the game with this code: " + game.title
        );
      } catch (e) { }
    }
  } else {
    if (
      command === "code" ||
      command === "bingo" ||
      command === "bongo" ||
      command === "join" ||
      command === "link"
    ) {
      try {
        client.say(
          channel,
          "🤖 This is a private lobby :( Try asking the host for the code."
        );
      } catch (e) { }
    }
  }
});

export const join = (channel: string, lobby: Game | GeoBingoAgainstHumanityGame) => {
  try {
    client.join("#" + channel).catch((e) => console.log(e));
    // client.say(
    //   "#" + channel,
    //   `🤖 ${process.env.domain} just connected to twitch chat. You can use !link or !code to join the game. If you like the game join the discord server and follow the twitch category. You can also support me on https://ko-fi.com/soerenmichaels <3.` +
    //   (!lobby.privateLobby ? "The code is " + lobby.title : "")
    // );
    lobbies["#" + channel.toLowerCase()] = lobby;
  } catch (e) {
    console.log(e);
  }
};
export const disconnect = (channel: string) => {
  try {
    client.part("#" + channel).catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
};
