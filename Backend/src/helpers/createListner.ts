import type { MySocket } from "../types"

type FN = (...args: any[]) => any

export default (socket: MySocket
  , nameSpace: string | string[], fns: FN[]) => {
  for (let fn of fns) {
    if (typeof nameSpace === "string") {
      socket.on(nameSpace + ":" + fn.name, fn)
    }
    for (const n of nameSpace) {
      socket.on(n + ":" + fn.name, fn)
    }
    console.log("listening to", nameSpace + ":" + fn.name)
  }

}
