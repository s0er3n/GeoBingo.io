import dotEnv from "dotenv";

import express from "express"

import bodyParser from "body-parser"

import { createServer as http } from "http";

import authHandler from "./eventHandler/authHandler"
import playerHandler from "./eventHandler/playerHandler"
import normalGameHandler from "./eventHandler/normalGameHandler"
import baseGameHandler from "./eventHandler/baseGameHandler";

import { Server } from "socket.io";
import { addKofiDonation } from "./helpers/api";
import { updateWhiteList } from "./helpers/variables";

dotEnv.config({ path: "/home/soeren/Programming/GeoBingo/.env" });

import type { MySocket } from "./types"
import gahGameHandler from "./eventHandler/gahGameHandler";
import MMGameHandler from "./eventHandler/MMGameHandler";


const app = express()

app.use(bodyParser.urlencoded({ extended: false }));

// updating white list every hour
updateWhiteList()

setInterval(
  updateWhiteList, 3600000)



const options = {
  cors: {
    origin: "*",

  },
};


const httpServer = http(app);







// TODO: fix type 
const io = new Server(httpServer, options);

const onConnection = (socket: MySocket) => {
  authHandler(io, socket)
  baseGameHandler(io, socket)
  normalGameHandler(io, socket)
  playerHandler(io, socket)
  gahGameHandler(io, socket)
  MMGameHandler(io, socket)

  socket.on("disconnect", () => {

    if (socket.player) {

      console.log(socket.player.name, "went offline");

      socket.player.removeSocket(socket);
    } else {
      console.log("non registered person went offline");
    }
  });
}


io.on("connection", onConnection)







//   // GeoBingoAgainstHumanity


//   socket.on("gah.host", (privateLobby: boolean, callback: Function) => {

//     if (typeof privateLobby !== "boolean") return

//     if (!checkCallback(callback)) return

//     if (!checkIfPlayer(socket)) {
//       console.log("player object not found cannot host");
//       return;
//     }

//     let roomName: string = makeRoomName();

//     let game = new GeoBingoAgainstHumanity(socket.player!, roomName, privateLobby);

//     lobbies[roomName] = game;


//     game.host.lobby = game;

//     console.log(
//       socket.player?.toObj(),

//       socket.player?.lobby?.privateLobby,
//       "is hosting",
//       makeRoomName
//     );
//     callback(roomName);
//   });

//   socket.on("gah.join", (lobby: string, callback: Function) => {
//     if (!checkCallback(callback)) return

//     if (!checkIfPlayer(socket)) {
//       console.log("player not found");
//       return;
//     }

//     if (!lobby) return

//     lobby = lobby.trim().toLowerCase();
//     if (lobbies[lobby] === undefined) {
//       console.log("room not found");
//       callback("room not found");
//       return;
//     }

//     if (socket.player) {


//       if (lobbies[lobby].playersKicked.has(socket.player)) {
//         console.log("player kicked");
//         return;
//       }
//     }

//     if (!socket.player) {
//       return
//     }
//     if (lobbies[lobby].players.size >= lobbies[lobby].size && !lobbies[lobby].players.has(socket.player)) {
//       console.log("room full")
//       callback("lobby full")
//       return
//     }

//     if (lobbies[lobby].onlyAuth) {

//       if (!socket.player.auth!.provider) {
//         callback("twitch only lobby");
//         return;
//       }
//     }

//     if (lobbies[lobby].banned_ips.has(socket.handshake.address)) {
//       return;
//     }

//     socket.player.lobby = lobbies[lobby];

//     lobbies[lobby].join(socket.player);

//     socket.player.lobby.updateLobby();

//     if (checkIfHost(socket)) {
//       if (

//         socket.player.auth?.provider === "twitch" &&

//         streamerWhiteList.map(streamer => streamer.toLowerCase()).includes(socket.player.auth.name.toLowerCase())
//       ) {

//         setStreamerFrontPage(socket.player.auth.name)
//       }

//       if (socket.player.auth?.provider === "twitch") {

//         join(socket.player.auth.name, socket.player.lobby);
//       }
//     }

//     callback("success");
//   })

//   socket.on("gah.leave", (callback: Function) => {
//     if (!checkCallback(callback)) return

//     if (!checkIfPlayer(socket)) {
//       return;
//     }
//     // TODO either not show player if is not in lobby or delete player from lobby


//     if (!socket.player?.lobby) {
//       return
//     }
//     socket.player.lobby = undefined;

//     socket.player.updateSelf()
//     callback("success");
//   });

// });

httpServer.listen(process.env.server_port);

// webhook
app.post("/webhook/donations", async (req, res) => {
  const data = JSON.parse(req.body.data)
  if (data.verification_token === "4bda3d8d-fbb2-4800-b459-4bca3b0936b9") {
    delete data["shop_items"]
    delete data["tier_name"]
    delete data["verification_token"]
    console.log(data)
    let error = await addKofiDonation(data)
    if (!error) {
      res.sendStatus(200)
    }
    else {
      console.log(error)
      res.sendStatus(400)
    }
  } else res.sendStatus(400)

})
