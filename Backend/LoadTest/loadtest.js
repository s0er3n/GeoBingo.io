import { io } from  "socket.io-client";
import pkg from "prompt-sync"
const prompt  = pkg()

const LOCAL  = true
const URL = LOCAL ? "http://localhost:1000" : "https://mainbackend.soerensserver.xyz";
const MAX_CLIENTS = 100
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const room = prompt("Room: ")

const socket = io(URL, );


const createClient = () => {
  // for demonstration purposes, some clients stay stuck in HTTP long-polling
  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

  const socket = io(URL, {
    transports,
  });

  socket.emit("init", undefined, (response) => {

    const token = response.guestToken
  setInterval(() => {

      socket.emit("join",room, (response)=>{
          // console.log(response)
          // console.log(response)
          // console.log("event")
            socket.emit('changeName', token, (Math.random() + 1).toString(36).substring(7), (response) => { })
            packetsSinceLastReport++;
      } )

      // socket.emit("leave", response => {

        socket.emit('vote', "keep", 0)

      // })


  }, EMIT_INTERVAL_IN_MS);

  })
  // socket.on("server to client event", () => {
  //   packetsSinceLastReport++;
  // });

  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);
