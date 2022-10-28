/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import createListner from "../helpers/createListner";
import type { MySocket, Pano } from "../types";
import {
        checkIfPlayer,
        checkIfHost,
        checkIfLobby,
        checkCallback,
        isGame,
} from "../helpers/checkers";
import {
        addWordToDB as addWordToDBAPI,
        reportWord as reportWordApi,
} from "../helpers/api";
import Game from "../objects/NormalGameModes/Game";

export default (io: unknown, socket: MySocket) => {
        const addWords = (newWords: { word: string; tags: string[] }) => {
                if (!newWords) return;

                if (newWords?.word !== "") {
                        if (typeof newWords?.word !== "string") return;
                        addWordToDBAPI(newWords);
                }
        };

        // socket.on("getWords", (callback) => {
        //   refreshWords();
        //   words = words;
        //   callback({ words: words });
        // });
        const newRandomWord = (i: number) => {
                if (typeof i !== "number") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }
                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }

                socket.player.lobby.newRandomWord(i);
        };

        const newRandomWords = (lockedWords: number[]) => {
                if (typeof lockedWords === "undefined") return;
                if (!Array.isArray(lockedWords)) return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }

                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }

                socket.player?.lobby?.newRandomWords(lockedWords);
        };

        const changeWord = (newWord: string, i: number) => {
                if (typeof i !== "number") return;
                if (!newWord) return;
                if (typeof newWord !== "string") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }

                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }

                socket.player?.lobby?.changeWord(newWord, i);
        };

        const addWordToGame = () => {
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }

                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }
                socket.player?.lobby?.addWordToGame();
        };

        const addCustomWordToGame = (newWord: string, database: boolean) => {
                if (!newWord) return;
                if (typeof newWord !== "string") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }
                if (!newWord) {
                        return;
                }

                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }

                // let word = { word: newWord, tags: ["english"] };

                if (database) {
                        newWord.split(";").forEach((word) => {
                                if (word.length <= 100) {
                                        addWordToDBAPI({ word, tags: [] });
                                }
                        });
                }

                socket.player?.lobby?.addCustomWordToGame(newWord);
        };

        const addWordToDB = (newWord: string) => {
                if (!newWord) return;
                if (typeof newWord !== "string") return;
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }
                if (!newWord) {
                        return;
                }

                // let word = { word: newWord, tags: ["english"] };

                newWord.split(";").forEach((word) => {
                        addWordToDBAPI({ word, tags: [] });
                });
        };

        const addSuggestWord = (suggestedWord: string) => {
                if (typeof suggestedWord !== "string") {
                        return;
                }
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }
                if (!suggestedWord) {
                        return;
                }
                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }

                socket.player?.lobby?.addWordSuggestion(
                        suggestedWord,
                        socket.player.auth!.name
                );
        };

        const clearSuggestions = () => {
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }
                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }
                socket.player!.lobby!.clearSuggestions();
        };

        const removeWordSuggestion = (removedWord: string) => {
                if (typeof removedWord !== "string") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }
                if (!removedWord) {
                        return;
                }

                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }
                socket.player?.lobby?.removeWordSuggestion(removedWord);
        };

        const addWordSuggestionToWords = (addedWord: string) => {
                if (typeof addedWord !== "string") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }
                if (!addedWord) {
                        return;
                }
                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }

                socket.player?.lobby?.addWordSuggestionToWords(addedWord);
        };

        const deleteWord = (i: number) => {
                if (typeof i !== "number") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player not host ");
                        return;
                }

                if (!isGame(socket.player.lobby)) {
                        console.log("wrong game");
                        return;
                }
                socket.player?.lobby?.deleteWord(i);
        };

        /* socket.on("getGames", (callback) => { */
        /*   if (!checkCallback(callback)) return */
        /*   let games = []; */
        /*   Object.keys(lobbys).forEach((gameKey) => { */
        /*     if (gameKey) { */
        /*       let room = { */
        /*         code: gameKey, */
        /*         playerCount: Object.values([...lobbys[gameKey].players]).filter( */
        /*           (player) => player.online */
        /*         ).length, */

        /*         title: states[gameKey].title, */
        /*       }; */
        /*       let isHostOnline = lobbys[gameKey].isHostOnline(); */

        /*       if ( */

        /*         states[gameKey].public && */
        /*         room.playerCount > 0 && */
        /*         isHostOnline > 0 */
        /*       ) { */
        /*         games.push(room); */
        /*       } */
        /*     } */
        /*   }); */

        /*   callback({ games }); */
        /* }); */

        const addCapture = (i: number, pano: Pano, callback: any) => {
                if (typeof i !== "number") return;
                if (!checkCallback(callback)) return;
                if (!pano) return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        callback("fail", "player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("player not in lobby no need to update");
                        callback("fail", "not in lobby");
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                let res;
                if (socket.player) {
                        res = socket.player!.lobby!.addCapture(socket.player, pano, i);
                        socket.player!.updateEveryoneInSameLobby();
                        callback(res);
                }
        };

        const backToGameOver = (callback: Function) => {
                if (!checkCallback(callback)) return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        callback("fail", "player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        callback("fail");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        callback("fail");
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                socket.player!.lobby!.goBackToGameOver();
                return "success";
        };
        const score = (callback: Function) => {
                if (!checkCallback(callback)) return;

                if (!checkIfPlayer(socket)) {
                        callback("fail");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        callback("fail");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        callback("fail");
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.goToScore();
                return "success";
        };
        const endGame = (callback: Function) => {
                if (!checkCallback(callback)) return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        callback("fail", "player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        callback("fail");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        callback("fail");
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                socket.player!.lobby!.goToGameOver();
                return "success";
        };
        const lobby = (callback: Function) => {
                if (!checkCallback(callback)) return;

                if (!checkIfPlayer(socket)) {
                        callback("fail");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        callback("fail");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        callback("fail");
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.goToLobby();

                return "success";
        };

        const reportAsNSFW = (i: number, reason: string) => {
                if (typeof i !== "number") return;

                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                if (!reason) {
                        console.log("no reason");
                        return;
                }

                // saveReportedPanosInDB(socket.player.lobby.captures[i].pano.pano.pano, reason, socket.player)

                socket.player!.lobby!.captures[i].nsfw = true;

                socket.player!.updateEveryoneInSameLobby();
        };

        const reportWord = async (word: number) => {
                if (typeof word !== "number") return;

                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }
                if (socket.player!.lobby!.host !== socket.player) {
                        return;
                }
                if (socket.player.lobby instanceof Game) {
                        socket.player.lobby.reportWord(word)
                };
        }

        const remove = (val: boolean, i: number) => {
                if (typeof val !== "boolean") return;

                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.captures[i].changeRemove(val);

                socket.player!.lobby!.updateLobby();
                return "success";
        };

        const switchExtraVoteCapture = (val: boolean, i: number) => {
                if (typeof val !== "boolean") return;
                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.captures[i].switchExtraVoteCapture(val);

                socket.player!.lobby!.updateLobby();
                return "success";
        };
        const switchAnonVoting = (val: boolean) => {
                if (typeof val !== "boolean") return;
                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                socket.player!.lobby!.anonVoting = val;

                socket.player!.lobby!.updateLobby();
                return "success";
        };
        const switchAllowEveryoneToVote = (val: boolean) => {
                if (typeof val !== "boolean") return;

                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                socket.player.lobby.allowEveryoneToVote = val;

                socket.player.lobby.updateLobby();

                return "success";
        };

        const setCaptureIndex = (newVal: number) => {
                if (typeof newVal !== "number") return;
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("lobby not found");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        console.log("player has to be host to change index");
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.setCaptureIndex(newVal);
        };

        const changeRestriction = (data: { key: string, val: string, lat: string, lng: string }) => {

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("lobby not found");
                        return;
                }

                if (!checkIfHost(socket)) {
                        console.log("player has to be host to start game");
                        return;
                }
                // @ts-ignore 
                if (!isGame(socket!.player!.lobby)) {
                        return;
                }

                socket!.player!.lobby!.changeRestriction(data);
        };

        const changeLang = (lang: string) => {
                if (typeof lang !== "string") return;

                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("lobby not found");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        console.log("player has to be host to start game");
                        return;
                }
                if (!isGame(socket.player!.lobby)) {
                        return;
                }

                socket.player!.lobby!.changeLang(lang);
        };

        const vote = (vote: "keep" | "remove", index: number) => {
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("lobby not found");
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player.lobby.vote(vote, socket.player!.auth!.name, index);
        };

        const startGame = () => {
                if (!checkIfPlayer(socket)) {
                        console.log("player not found");
                        return;
                }

                if (!checkIfLobby(socket)) {
                        console.log("lobby not found");
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        console.log("player has to be host to start game");
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.startGame();

                console.log("starting game ending :", socket.player!.lobby!.gameEndTime);
        };

        const switchOnlyOfficialCoverage = (val: boolean) => {
                if (typeof val !== "boolean") return;
                if (!checkIfPlayer(socket)) {
                        return;
                }

                if (!checkIfLobby(socket)) {
                        return;
                }

                if (socket.player!.lobby!.host !== socket.player) {
                        return;
                }

                if (!isGame(socket.player!.lobby)) {
                        return;
                }
                socket.player!.lobby!.onlyOfficialCoverage = val;

                socket.player!.lobby!.updateLobby();
                return "success";
        };

        createListner(socket, "normalGame", [
                newRandomWords,
                addWords,
                newRandomWord,
                changeWord,
                addWordToGame,
                addCustomWordToGame,
                addWordToDB,
                addSuggestWord,
                clearSuggestions,
                removeWordSuggestion,
                addWordSuggestionToWords,
                deleteWord,
                addCapture,
                backToGameOver,
                score,
                endGame,
                lobby,
                reportAsNSFW,
                reportWord,
                remove,
                switchExtraVoteCapture,
                switchAnonVoting,
                switchAllowEveryoneToVote,
                setCaptureIndex,
                changeRestriction,
                vote,
                startGame,
                switchOnlyOfficialCoverage,
                changeLang,
        ]);
};
