import Auth from "../objects/Auth"
import jwt from "jsonwebtoken";
import players from "../objects/PlayerHandler"
import Player from "../objects/Player";
import { MySocket } from "../types";

let jwtpriv: string = process.env.jwtpriv!

export const verifyAndGetAuth = (token: string) => {
  let decode: any;
  try {
    decode = jwt.verify(token, jwtpriv, { ignoreExpiration: true });
  } catch (e) {
    console.log(e)
  }
  // console.log(decode)
  if (!decode) {
    return
  }
  return new Auth(
    decode.sub,
    decode.app_metadata?.provider,
    decode.user_metadata.nickname,
    decode.user_metadata?.avatar_url
  );

}

export const makeGuestToken = (sub: string, nickname: string) => {
  return jwt.sign({ user_metadata: { nickname }, sub }, jwtpriv, { expiresIn: "30d" })
}

const decodeToken = (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, jwtpriv);
  } catch (e) {
    console.log(e);
  }
  return decoded
}


export const updateTokenAndAuth = (token: string, player: Player, name: string) => {
  let decoded: any = decodeToken(token)
  if (!decoded) {
    console.log("couldnt decode token")
    return
  }
  decoded.user_metadata.nickname = name
  token = makeGuestToken(decoded.sub, name)
  player.auth = verifyAndGetAuth(token)
  return token
}


export const changeAuth = (token: string, socket: MySocket) => {
  let decodedToken: any = decodeToken(token)

  if (!decodedToken) {
    console.log("couldnt decode token:", token)
    return
  }


  let auth = new Auth(
    decodedToken.sub,
    decodedToken.app_metadata?.provider,
    decodedToken.user_metadata.nickname,
    decodedToken.user_metadata.avatar_url
  );



  let player = players.getPlayerBySub(auth.sub)

  if (!socket.player) {
    return
  }
  if (player === socket.player && player) {
    player.auth = auth
  } else if (player) {
    player.auth = auth
    socket.player = player
    socket.player.addSocket(socket)
  }
  else {
    socket.player.auth = auth
  }
  socket.player?.updateSelf()
}
