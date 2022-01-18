import { Injectable } from '@angular/core';
import axios from '../axios/axios';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameMode: GameMode;
  private gameId: string;
  constructor(private userService: UserService) {}

  async startNewOnlineGame() {
    const userId = this.userService.getCurrentUserId();
    const createGameData = {
      userId,
    };
    const gameData = await axios.post('games/join', createGameData);
    this.gameId = gameData.data.gameId;
    return gameData.data;
  }

  async startNewSoloGame() {
    const userId = this.userService.getCurrentUserId();
    const createGameData = {
      userId,
    };
    const gameData = await axios.post('games/create', createGameData);
    this.gameId = gameData.data.gameId;
    return gameData.data;
  }

  setGameMode(mode: GameMode) {
    this.gameMode = mode;
  }

  getGameMode() {
    return this.gameMode;
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
}

export enum GameMode {
  online = 1,
  solo,
}
