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

  postRow(row: string) {
    const userId = this.userService.getCurrentUserId();
    const rowData = {
      gameId: this.gameId,
      playerName: userId,
      word: row,
    };
    return axios.post('play/row', rowData);
  }

  async getOpponentStatus(opponentId: string) {
    const statusData = await axios.get(
      `games/game/${this.gameId}/status/${opponentId}`
    );
    return statusData.data;
  }
}

export enum GameMode {
  online = 1,
  solo,
}
