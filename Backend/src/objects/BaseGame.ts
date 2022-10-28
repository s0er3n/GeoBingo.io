import schedule from "node-schedule";
import _ from "lodash";
import Player from "./Player";
import players from "./PlayerHandler";
const { debounce } = _;

export default class BaseGame {
  currentScheduledJob: undefined | any;
  host?: Player;
  banned_ips = new Set();
  players: Set<Player> = new Set();
  playersKicked: Set<Player> = new Set();
  size = 50;
  time = 10;
  privateLobby = false;
  onlyAuth = false;
  title;
  gameEndTime: Date | undefined;
  constructor(roomName: string, privateLobby: boolean) {
    this.title = roomName;
    this.privateLobby = privateLobby;
  }

  makeHost(playerId: string) {
    const player = players.getPlayerBySub(playerId);
    if (player) {
      this.host = player;
      this.updateLobby();
    }
  }

  join(player: Player) {
    console.log(player?.auth?.name, "joined lobby", this.title);
    this.players.add(player);
    this.updateLobby();
    player.updateSelf();
  }

  kick(player: Player) {
    player.lobby = undefined;
    this.playersKicked.add(player);
    this.players.delete(player);
    player.updateSelf();
    this.updateLobby();
  }

  updateLobbyWithoutDebounce = () =>
    this.players.forEach((player): void => {
      player.updateSelf();
    });

  updateLobby = debounce(this.updateLobbyWithoutDebounce, 100, {
    maxWait: 300,
    leading: true,
  });

  startGame(gameOverCallback: () => void) {
    const newGameEndTime = new Date(Date.now() + this.time * 60000);
    this.gameEndTime = newGameEndTime;
    this.currentScheduledJob = schedule.scheduleJob(newGameEndTime, () => {
      gameOverCallback();
      this.updateLobby();
    });
    this.updateLobby();
  }

  changeTime(time: number) {
    this.time = time;
    this.updateLobby();
  }

  changeSize(size: number) {
    this.size = size;
    this.updateLobby();
  }

  toGameState() {
    //
  }

  setOnlyTwitch(val: boolean) {
    this.onlyAuth = val;
    if (this.onlyAuth) {
      this.players.forEach((player) => {
        const playerLoggedInWithTwitch = player.auth!.provider;
        console.log(player.auth!.provider);
        if (!playerLoggedInWithTwitch) {
          player.lobby = undefined;
          player.updateSelf();
        }
      });
    }
  }
}
