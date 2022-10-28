import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_DOMAIN ?? "localhost:8000", {
  closeOnBeforeunload: false, // defaults to true,
});

export default socket;
