import Auth from "./Auth";
import Player from "./Player";
class PlayerHandler {
  players: Player[] = [];

  createNewPlayer(auth: Auth) {
    const newPLayer = new Player(auth);
    this.players.push(newPLayer);
    return newPLayer;
  }

  getPlayerBySub(sub: string): Player | undefined {
    const foundPlayer = this.players.find(
      (player: Player) => player.getSub() === sub
    );
    return foundPlayer;
  }
  getPlayerOrCreatePlayer(auth: Auth) {
    const player = this.getPlayerBySub(auth.sub);
    if (player) {
      player.auth = auth;
      return player;
    }
    return this.createNewPlayer(auth);
  }
}

const players = new PlayerHandler();
export default players;
