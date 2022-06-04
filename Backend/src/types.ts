import { Socket } from "socket.io";
import Auth from "./objects/Auth";
import Player from "./objects/Player";

export type MySocket = Socket & { auth?: Auth, player?: Player }
export type Pano = { pano: { pano: string, pov: { heading: number, pitch: number, zoom: number } }, position: { lat: number, long: number } }
