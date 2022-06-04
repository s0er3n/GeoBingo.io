import {
  browser
} from '$app/env';

import { NormalGame } from "./NormalGame"
import { MMGame } from "./MMGame"
import { GeoBingoAgainstHumanity } from "./GeoBingoAgainstHumanity"
import { Player } from "./Player"
import {
  supabase
} from './supabaseClient.js';

import socket from "./socket"

import type { Socket } from "socket.io-client"

import { WritableClass } from "../helpers/WriteableClass"

// dont forget to refresh if you want things to update reactivly

type CountryBounds = {
  east: number,
  north: number,
  south: number,
  west: number,
}

export class Api extends WritableClass {
  playerLoaded = false
  streamerFrontPage = ""
  geometries = []
  socket: Socket
  player: Player
  bounds: CountryBounds[]
  game?: NormalGame | GeoBingoAgainstHumanity | MMGame
  timeDelta: number


  get token() { return this.getToken() }

  init() {

    socket.emit('auth:init', this.token, (response: any) => {
      if (!response) {
        console.log("no response so no token")
        return
      }

      console.log(response.time)
      this.timeDelta = Date.now() - response.time
      console.log(this.timeDelta)

      this.streamerFrontPage = response.streamerFrontPage;

      if (response.guestToken) {
        localStorage.setItem("guestToken", JSON.stringify({
          access_token: response.guestToken
        }))

      }
      this.geometries = response.geometries.sort();

      const [player, game] = response.playerAndGame

      //TODO: different game modes
      if (game?.gameMode === "NormalGame") {
        this.game = new NormalGame(game)
      }
      else if (game?.gameMode === "gah") {
        this.game = new GeoBingoAgainstHumanity(game)
      }
      else if (game?.gameMode === "MMGame") {
        this.game = new MMGame(game)
      }
      else {
        this.game = undefined
      }

      this.bounds = response.bounds
      this.player = new Player(player)

      this.playerLoaded = true
      this.refresh()
    });
  }

  getHost = (playerId = this.player.id) => {
    console.log(this.player)
    if (!playerId) return false
    if (this.game instanceof MMGame) return false

    if (!this.game) return false

    console.log(playerId)
    console.log("current host", this.game.currentPhase.host.id)
    console.log("playerId", playerId)
    if (this.game.currentPhase.host.id === playerId) {
      return true
    }
    else return false
  }

  get isHost() {
    return this.getHost()

  }



  listenToUpdates() {
    socket.on('update', (res) => {
      const [player, game] = res
      //TODO: send player and game seperately from Backend
      // TODO: Update classes
      console.log(player, game)

      if (!this.player) {
        this.player = new Player(player)
      } else {
        this.player.updateSelf(player)
      }

      if (!game) {
        this.game = undefined
        this.refresh()
        return
      }

      if (!this.game && game || this.game.gameMode !== game.gameMode && typeof game.gameMode !== undefined) {

        if (game.gameMode === "NormalGame") {
          this.game = new NormalGame(game)
        } else if (game.gameMode === "gah") {
          this.game = new GeoBingoAgainstHumanity(game)
        }
        else if (game.gameMode === "MMGame") {
          this.game = new MMGame(game)
        }
      } else {
        if (game) {
          this.game.updateGamePhase(game)
        } else {
          this.game = undefined
        }
      }
      // maybe remove refresh from other classes and only refresh here
      this.refresh()
    });
  }




  // getGames(callback) {
  //   this.socket.emit('getGames', (response) => {
  //     callback(response.games);
  //   });
  // }

  // getWords() {
  // 	this.socket.emit('getWords', (response) => {
  // 		this.words = response.words;
  // 	});
  // }



  getToken() {

    let session = supabase.auth.session()

    let token: string | undefined

    if (supabase.auth.session()?.access_token) {
      if (browser) {
        token = session?.access_token
        return token
      }
    }

    token = JSON.parse(localStorage.getItem("guestToken"))?.access_token
    return token
  }

  constructor() {
    super()


    this.listenToUpdates();
    // calling once bc it some times doesnt get session at first try
    supabase.auth.session()
    socket.on("connect", () => {
      this.init()
    })


  }
}



let c: Api = new Api();

export const api = c;
