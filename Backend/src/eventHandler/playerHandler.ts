
import createListner from "../helpers/createListner"
import type { MySocket } from "../types"
import { checkIfPlayer } from "../helpers/checkers"
import { updateEquipedSkin as updateEquipedSkinInDB } from "../helpers/api"
export default (io: unknown, socket: MySocket) => { 
  const updateEquipedSkin = async (newVal: number) => {
    if (typeof newVal !== "number") return
    if (!checkIfPlayer(socket)) {
      console.log("player not found");
      return;
    }
    if (!socket.player!.auth) {
      console.log("auth not found");
      return;
    }
    await updateEquipedSkinInDB(socket.player!.auth, newVal)
    socket.player!.updateSelf()
  };


createListner(socket, "player",[updateEquipedSkin])
}