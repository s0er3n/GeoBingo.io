"use strict";
import { Pano } from "../../types";
import Auth from "../Auth";
import GeoBingoAgainstHumanity from "./GeoBingoAgainstHumanity";
import Player from "../Player";

function createGame() {
  const auth = new Auth("123-sub", "", "sören", "test.png");
  const host = new Player(auth);
  const game = new GeoBingoAgainstHumanity(host, "room1", false);
  const auth2 = new Auth("1234-sub", "", "tilman", "test.png");
  const player = new Player(auth2);
  game.join(player);
  return game;
}
let game: GeoBingoAgainstHumanity;

beforeEach(() => {
  game = createGame();
});

describe("Testing GeoBingo Against Humanity", () => {
  it("testing join", () => {
    const auth = new Auth("123-sub", "", "sören", "test.png");
    const host = new Player(auth);
    const auth2 = new Auth("1234-sub", "", "tilman", "test.png");
    const player = new Player(auth2);
    expect(game.toGameState().players).toContainEqual(player.toObj());
    expect(game.toGameState().players).toContainEqual(host.toObj());
  });
  describe("ingame", () => {
    it("gamephase = ingame", () => {
      game.start();
      expect(game.gamePhase).toBe("ingame");
    });
    it("add 2 images", () => {
      game.start();
      const pano: Pano = {
        pano: { pano: "123", pov: { heading: 0, pitch: 0, zoom: 0 } },
        position: { lat: 0, long: 1 },
      };
      const player: Player = game.host;
      const index = 1;

      game.makeCapture(pano, player, index);
      expect(game.toGameState().captures[0].captures[index].pano.pano).toBe(
        "123"
      );
    });
    it("time should be there", () => {
      game.start();
      expect(game.gameEndTime).toBeDefined();
    });
    it("end game. gamephase = lobby", () => {
      game.end();
      expect(game.gamePhase).toBe("lobby");
      game.start();
    });
    it("should be gamephase = lobby with captures", () => {
      const pano: Pano = {
        pano: { pano: "123", pov: { heading: 0, pitch: 0, zoom: 0 } },
        position: { lat: 0, long: 1 },
      };
      const player: Player = game.host;
      const index = 1;
      game.makeCapture(pano, player, index);
      game.end();
      expect(game.gamePhase).toBe("voting");
    });
  });
  describe("voting", () => {
    it("should be 3 votes for the first capture store ", () => {
      const pano: Pano = {
        pano: { pano: "123", pov: { heading: 0, pitch: 0, zoom: 0 } },
        position: { lat: 0, long: 1 },
      };
      const player: Player = game.host;
      const player2: Player = Array.from(game.players)[1];
      game.start();
      game.makeCapture(pano, player, 1);
      game.makeCapture(pano, player, 2);
      game.makeCapture(pano, player2, 1);
      game.makeCapture(pano, player2, 2);
      game.end();
      game.voting!.addVote("söri", 0);
      game.voting!.addVote("söri", 0);
      game.voting!.addVote("söri3", 0);
      game.voting!.addVote("söri2", 0);
      game.voting!.addVote("söri2", 1);
      game.voting!.addVote("söri4", 1);
      game.voting!.addVote("söri5", 1);
      const score = game.voting?.createScore();
      console.log(score);
      const playerKeyAsJSONString = JSON.stringify(player.toObj());
      const playerKeyAsJSONString2 = JSON.stringify(player2.toObj());
      const scoreExpected = [
        { [playerKeyAsJSONString]: 2 },
        { [playerKeyAsJSONString2]: 1 },
      ];
      console.log(scoreExpected, score);
      expect(score).toEqual(scoreExpected);
    });
    it.todo("everyone can only vote once");
    it.todo("the one with the most votes wins");
  });
});
