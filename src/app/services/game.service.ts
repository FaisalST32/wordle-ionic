import { Injectable } from '@angular/core';
import axios from '../axios/axios';
import { LetterStates, LetterType } from '../components/row/row.component';
import { UserService } from './user.service';

const GAME_SEARCH_TIMEOUT = 30_000;
@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameMode: GameMode;
  private gameId: string;
  private gameCode: string;
  constructor(private userService: UserService) {}

  async startGame(): Promise<Partial<GameResponse>> {
    if (this.gameMode === GameMode.solo) {
      return this.startNewSoloGame();
    }
    if (this.gameMode === GameMode.online && !this.gameCode) {
      return this.startNewOnlineGame();
    }
    return this.startGameWithCode(this.gameCode);
  }

  async startNewOnlineGame() {
    try {
      const userId = this.userService.getCurrentUserId();
      const createGameData = {
        userId,
      };
      const gameData = await axios.post('games/join-or-create', createGameData);
      if (gameData.data.status === 'pending') {
        return this.waitForGameToBegin(gameData.data.gameId);
      }
      this.gameId = gameData.data.gameId;
      return gameData.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.error ||
          err.message ||
          'Something happened. Please try again!'
      );
    }
  }

  async startNewSoloGame() {
    try {
      const userId = this.userService.getCurrentUserId();
      const createGameData = {
        userId,
      };
      const gameData = await axios.post('games/join-solo', createGameData);
      this.gameId = gameData.data.gameId;
      return gameData.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.error || 'Something happened. Please try again!'
      );
    }
  }

  async startGameWithCode(gameCode: string) {
    try {
      const userId = this.userService.getCurrentUserId();
      const joinGameData = {
        userId,
        gameCode: gameCode.toUpperCase(),
      };
      const gameData = await axios.post(
        'games/v2/join-with-code',
        joinGameData
      );
      if (gameData.data.status === 'pending') {
        return this.waitForGameToBegin(
          gameData.data.gameId,
          'No one joined. Please try again.'
        );
      }
      this.gameId = gameData.data.gameId;
      return gameData.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.error ||
          err.message ||
          'Something happened. Please try again!'
      );
    }
  }

  setGameMode(mode: GameMode) {
    this.gameMode = mode;
  }

  getGameMode(): GameMode {
    return this.gameMode;
  }

  setGameCode(code: string) {
    this.gameCode = code;
  }

  getGameCode(): string {
    return this.gameCode;
  }

  async postRow(row: string) {
    try {
      const userId = this.userService.getCurrentUserId();
      const rowData = {
        gameId: this.gameId,
        playerName: userId,
        word: row,
      };
      const resp = await axios.post('play/row', rowData);
      return resp;
    } catch (err) {
      throw new Error(
        err?.response?.data?.error || 'Something happened. Please try again!'
      );
    }
  }

  async getOpponentStatus(opponentId: string) {
    const statusData = await axios.get(
      `games/game/${this.gameId}/status/${opponentId}`
    );
    return statusData.data;
  }

  async getCurrentWordle(): Promise<string> {
    const statusData = await axios.get(`games/game/${this.gameId}/wordle`);
    return statusData.data.wordle;
  }

  async getNewGameCode(): Promise<string> {
    try {
      const payload = { userId: this.userService.getCurrentUserId() };
      const gameData = await axios.post('games/generate-code', payload);
      const { gameCode, gameId } = gameData.data;
      this.gameId = gameId;
      return gameCode;
    } catch (err) {
      throw new Error(
        err?.response?.data?.error || 'Something happened. Please try again!'
      );
    }
  }

  private waitForGameToBegin(gameId: string, failMessage?: string) {
    const checkGameData = {
      playerId: this.userService.getCurrentUserId(),
      gameId,
    };
    return new Promise((res, rej) => {
      const interval = setInterval(async () => {
        const gameData = await axios.post(
          'games/poll-for-player',
          checkGameData
        );
        if (gameData.data.status === 'started') {
          clearInterval(interval);
          clearTimeout(timeout);
          this.gameId = gameData.data.gameId;
          res(gameData.data);
        }
      }, 2000);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        rej(
          new Error(
            failMessage || `Couldn't find a game online. Please try again.`
          )
        );
      }, GAME_SEARCH_TIMEOUT);
    });
  }
}

export enum GameMode {
  online = 1,
  solo,
}

export type GameResponse = {
  gameId: string;
  moves?: LetterType[][];
  opponentMoves?: LetterStates[][];
  opponentId: string;
};
