import socket from './socket';

import type GeoBingoAgainstHumanityGame from '../../../../Backend/src/objects/GeoBingoAgainstHumanity/GeoBingoAgainstHumanity';
import { supabase } from './supabaseClient.js';

type GamePhases = Lobby | Ingame | Score | VotingPhase;

type GamePhaseString = 'lobby' | 'ingame' | 'score' | 'votingphase';

// make Type

type gameStateFn = GeoBingoAgainstHumanityGame['toGameState'];
type GameObj = ReturnType<gameStateFn>;

export class GeoBingoAgainstHumanity {
	gameMode = 'gah';
	settings = new Settings();
	currentPhase: GamePhases;
	currentPhaseString: GamePhaseString;

	constructor(gameObj: GameObj) {
		this.updateGamePhase(gameObj);
	}

	makeHost(playerId: string) {
		socket.emit('gah:makeHost', playerId);
	}

	updateOrCreateGamePhase(gameObj: GameObj, typeOfPhase: any) {
		if (this.currentPhase instanceof typeOfPhase) {
			this.currentPhase.update(gameObj);
		} else {
			this.currentPhase = new typeOfPhase(gameObj);
		}
	}

	kick(playerId: string) {
		socket.emit('gah:kick', playerId);
	}

	updateGamePhase(gameObj: GameObj) {
		switch (gameObj.gamePhase) {
			case 'lobby': {
				this.currentPhaseString = gameObj.gamePhase;
				this.updateOrCreateGamePhase(gameObj, Lobby);
				break;
			}
			case 'ingame': {
				this.currentPhaseString = gameObj.gamePhase;
				this.updateOrCreateGamePhase(gameObj, Ingame);
				break;
			}
			case 'score': {
				this.currentPhaseString = gameObj.gamePhase;
				this.updateOrCreateGamePhase(gameObj, Score);
				break;
			}
			case 'voting': {
				this.currentPhaseString = 'votingphase';
				this.updateOrCreateGamePhase(gameObj, VotingPhase);
				break;
			}
		}
	}
}

type GamePhase = {
	update(gameObj: GameObj): void;
};

export class Lobby implements GamePhase {
	host: GameObj['host'];
	players: GameObj['players'];
	time: GameObj['time'];
	size: GameObj['size'];
	card: GameObj['card'];
	privateLobby: GameObj['privateLobby'];
	overallScore: GameObj['overallScore'];
	onlyAuth: GameObj['onlyAuth'];
	title: GameObj['title'];
	// suggestedWords: GameObj["suggestedWords"]
	country: GameObj['country'];
	// score: GameObj["score"]

	constructor(gameObj: GameObj) {
		this.update(gameObj);
	}

	startGame() {
		socket.emit('gah:start');
	}

	update(gameObj: GameObj): void {
		if (gameObj.gamePhase !== 'lobby') {
			throw 'update with wrong gameObj in lobby';
		}
		for (const [key, value] of Object.entries(gameObj)) {
			this[key] = value;
		}
	}

	newRandomCard() {
		socket.emit('gah:newRandomCard');
	}

	changeCard(c: string) {
		socket.emit('gah:changeCard', c);
	}

	clearSuggestions() {
		socket.emit('gah:clearSuggestions');
	}
}

export class Ingame implements GamePhase {
	host: GameObj['host'];
	players: GameObj['players'];
	time: GameObj['time'];
	size: GameObj['size'];
	card: GameObj['card'];
	privateLobby: GameObj['privateLobby'];
	onlyAuth: GameObj['onlyAuth'];
	title: GameObj['title'];
	// suggestedWords: GameObj["suggestedWords"]
	country: GameObj['country'];
	// score: GameObj["score"]
	gameEndTime: GameObj['gameEndTime'];
	captures: GameObj['captures'];

	constructor(gameObj: GameObj) {
		this.update(gameObj);
	}

	update(gameObj: GameObj): void {
		if (gameObj.gamePhase !== 'ingame') {
			throw 'update with wrong gameObj in ingame';
		}
		for (const [key, value] of Object.entries(gameObj)) {
			this[key] = value;
		}
	}
	makeCapture(i: number, pano: any) {
		console.log(pano);
		socket.emit('gah:makeCapture', i, pano);
	}

	endGame() {
		socket.emit('gah:endGame');
	}
}

export class Score implements GamePhase {
	captures: GameObj['captures'];
	// words: GameObj["words"]
	players: GameObj['players'];
	host: GameObj['host'];
	gamePhase: GameObj['gamePhase'];
	score: GameObj['score'];
	title: GameObj['title'];
	totalVotes: GameObj['totalVotes'];
	// oldScore: GameObj["oldScore"]

	constructor(gameObj: GameObj) {
		this.update(gameObj);
	}

	update(gameObj: GameObj): void {
		if (gameObj.gamePhase !== 'score') {
			throw 'update with wrong gameObj in ingame';
		}
		for (const [key, value] of Object.entries(gameObj)) {
			this[key] = value;
		}
	}

	goToLobby() {
		socket.emit('gah:goToLobby');
	}

	backToGameOver() {
		socket.emit('gah:backToGameOver', (response: string | undefined) =>
			console.log(response)
		);
	}
}

class Settings {
	switchAllowEveryoneToVote(val: boolean) {
		socket.emit('gah:switchAllowEveryoneToVote', val);
	}
	switchOnlyOfficialCoverage(val: boolean) {
		socket.emit('gah:switchOnlyOfficialCoverage', val);
	}
	switchOnlyTwitch(val: boolean) {
		socket.emit('gah:switchOnlyTwitch', val);
	}
	changeTime(time: number) {
		socket.emit('gah:changeTime', time);
	}
	changeSize(size: number) {
		socket.emit('gah:changeSize', size);
	}
	changeCountry(country: string) {
		socket.emit('gah:changeCountry', country);
	}
	switchAnonVoting(val: boolean) {
		socket.emit('gah:switchAnonVoting', val);
	}
}
export class VotingPhase implements GamePhase {
	host: GameObj['host'];
	gamePhase: GameObj['gamePhase'];

	players: GameObj['players'];
	captureIndex: GameObj['captureIndex'];
	title: GameObj['title'];
	card: GameObj['card'];
	score: GameObj['score'];
	voting: GameObj['voting'];
	captures: GameObj['captures'];

	constructor(gameObj: GameObj) {
		this.update(gameObj);
	}

	setCaptureIndex(newVal: number) {
		socket.emit('gah:setCaptureIndex', newVal);
	}
	update(gameObj: GameObj): void {
		if (gameObj.gamePhase !== 'voting') {
			throw 'update with wrong gameObj in VotingPhase';
		}
		for (const [key, value] of Object.entries(gameObj)) {
			this[key] = value;
		}
	}

	switchExtraVoteCapture(i: string, val: boolean) {
		socket.emit('switchExtraVoteCapture', i, val);
	}

	saveReportedPanosInDB = async (
		panoid: string,
		reason: string,
		playerId: string
	) => {
		try {
			// FIXME: captures are stored differently
			let { data, error } = await supabase
				.from('reportedPhotospheres')
				.insert({ panoid: panoid, reason, playerid: playerId });
			console.log(data, error);
		} catch (e) {
			console.log(e);
		}
	};

	async reportAsNSFW(panoid: string, reason: string, playerId: string) {
		// maybe i should consider doing this on server site
		// someone could write random stuff in the table

		try {
			await this.saveReportedPanosInDB(panoid, reason, playerId);
		} catch (e) {
			console.log(e);
		}

		socket.emit('gah:report', panoid);
	}
	goToScore() {
		console.log('score');
		socket.emit('gah:score');
	}
	vote(index: number) {
		socket.emit('gah:vote', index);
	}
}
