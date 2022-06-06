import express from "express";

import bodyParser from "body-parser";

import { createServer as http } from "http";

import authHandler from "./eventHandler/authHandler";
import playerHandler from "./eventHandler/playerHandler";
import normalGameHandler from "./eventHandler/normalGameHandler";
import baseGameHandler from "./eventHandler/baseGameHandler";

import { Server } from "socket.io";
import { addKofiDonation } from "./helpers/api";
import { updateWhiteList } from "./helpers/variables";


import type { MySocket } from "./types";
import gahGameHandler from "./eventHandler/gahGameHandler";
import MMGameHandler from "./eventHandler/MMGameHandler";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// updating white list every hour
updateWhiteList();

setInterval(updateWhiteList, 3600000);

const options = {
  cors: {
    origin: "*",
  },
};

const httpServer = http(app);

// TODO: fix type
const io = new Server(httpServer, options);

const onConnection = (socket: MySocket) => {
  authHandler(io, socket);
  baseGameHandler(io, socket);
  normalGameHandler(io, socket);
  playerHandler(io, socket);
  gahGameHandler(io, socket);
  MMGameHandler(io, socket);

  socket.on("disconnect", () => {
    if (socket.player) {
      console.log(socket.player.name, "went offline");

      socket.player.removeSocket(socket);
    } else {
      console.log("non registered person went offline");
    }
  });
};

io.on("connection", onConnection);
httpServer.listen(8000);

const KOFI_TOKEN = process.env.KOFI_TOKEN;
// webhook
app.post("/webhook/donations", async (req, res) => {
  const data = JSON.parse(req.body.data);
  if (data.verification_token === KOFI_TOKEN) {
    delete data["shop_items"];
    delete data["tier_name"];
    delete data["verification_token"];
    console.log(data);
    const error = await addKofiDonation(data);
    if (!error) {
      res.sendStatus(200);
    } else {
      console.log(error);
      res.sendStatus(400);
    }
  } else res.sendStatus(400);
});
