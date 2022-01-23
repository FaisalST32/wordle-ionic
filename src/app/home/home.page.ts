/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-for-of */
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LetterStates, LetterType } from '../components/row/row.component';
import { GameMode, GameService } from '../services/game.service';
import { WordleService } from '../services/wordle.service';
import { generateEmptyRow, generateInitialKeys } from '../utils/data.utils';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  activeRowIndex = 0;
  activeColumnIndex = 0;
  rows: LetterType[][] = [];
  opponentRows: LetterType[][] = [];
  gameOver = false;
  hasGameStarted = false;
  gameMode: GameMode;
  opponentId: string;
  keys: LetterType[][] = generateInitialKeys();
  loaderId: string;
  opponentPollingInterval: any;
  areKeysEnabled = false;

  constructor(
    private wordleService: WordleService,
    private alertCtrl: AlertController,
    private gameService: GameService,
    private loadingCtrl: LoadingController,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {
    this.initializeGame();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetGame();
        if (this.loaderId) {
          this.loadingCtrl.dismiss(this.loaderId);
          this.loaderId = '';
        }
        if (this.opponentPollingInterval) {
          clearInterval(this.opponentPollingInterval);
          this.opponentPollingInterval = null;
        }
        this.gameOver = true;
      }
    });
  }

  async initializeGame() {
    try {
      this.gameMode = this.gameService.getGameMode();
      if (!this.gameMode) {
        this.router.navigate(['/landing']);
      }
      await this.showLoader(
        this.gameMode === GameMode.solo
          ? 'Loading Game...'
          : 'Finding a game...'
      );
      const newGame = await this.gameService.startGame();
      const { opponentId, moves, opponentMoves } = newGame;
      this.setInitialRows(moves);
      if (opponentId) {
        this.opponentId = opponentId;
        this.hasGameStarted = true;
        this.setOpponentRows(opponentMoves);
        this.pollOpponentStatus();
      }

      this.activeRowIndex = 0;
      this.activeColumnIndex = 0;
      this.keys = generateInitialKeys();
      this.gameOver = false;
      this.enableKeys();
      this.hideLoader();
    } catch (err) {
      this.hideLoader();
      if (this.router.isActive) {
        this.showFinishAlert(err.message);
      }
    }
  }
  private setOpponentRows(
    opponentMoves?: LetterStates[][],
    currentRows?: LetterType[][]
  ) {
    this.opponentRows = currentRows || [
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
    ];
    if (opponentMoves?.length) {
      this.opponentRows.forEach((row, i) => {
        if (opponentMoves[i]) {
          row.forEach((letter, j) => {
            letter.state = opponentMoves[i][j];
            letter.character = ' ';
          });
        }
      });
    }
  }
  private setInitialRows(moves?: LetterType[][]) {
    this.rows = [
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
    ];
    if (moves?.length) {
      moves.forEach((move: LetterType[], index: number) => {
        this.rows[index] = move;
      });
    }
  }

  resetGame() {
    this.opponentRows = [
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
    ];
    this.activeRowIndex = 0;
    this.activeColumnIndex = 0;
    this.keys = generateInitialKeys();
    this.rows = [
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
      generateEmptyRow(),
    ];
    this.gameOver = false;
    this.enableKeys();
    this.hideLoader();
  }

  @HostListener('document:keydown', ['$event'])
  async onKeyUp(event: KeyboardEvent) {
    if (this.gameOver || !this.areKeysEnabled) {
      return;
    }
    const keyPressed = event.key;
    const isAlphabetKey: boolean = new RegExp(/^[a-z]$/).test(keyPressed);
    if (isAlphabetKey && this.activeColumnIndex < 5) {
      return this.handleAlphabetKey(keyPressed);
    }
    const isEnterKey = keyPressed.toLowerCase() === 'enter';
    if (isEnterKey) {
      return this.handleEnterKey();
    }

    const isBackspaceKey = keyPressed.toLowerCase() === 'backspace';
    if (isBackspaceKey) {
      return this.handleBackspaceKey();
    }
  }

  private handleAlphabetKey(key: string) {
    this.rows[this.activeRowIndex][this.activeColumnIndex].character =
      key.toUpperCase();
    this.activeColumnIndex++;
    return;
  }

  private async handleEnterKey() {
    try {
      this.disableKeys();
      const currentRow = this.rows[this.activeRowIndex];
      const isCurrentRowFilled = this.rows[this.activeRowIndex].every(
        (letter) => letter.character !== ''
      );
      if (!isCurrentRowFilled) {
        this.enableKeys();
        return;
      }

      const word: string = currentRow
        .map((letter) => letter.character)
        .join('');
      const rowResp = await this.gameService.postRow(word);
      const updatedRow = this.createUpdatedRow(rowResp.data.rowResponse, word);

      const hasWonGame: boolean = updatedRow.every(
        (letter) => letter.state === 'valid'
      );
      if (hasWonGame) {
        await this.showFinishAlert('Yay! You have won. Play again?');

        return;
      }
      if (!hasWonGame && this.activeRowIndex === 5) {
        if (this.gameMode === GameMode.solo) {
          const wordle: string = await this.gameService.getCurrentWordle();
          await this.showFinishAlert(
            `Tough luck! The correct wordle was ${wordle}`
          );
        } else {
          await this.showFinishAlert(
            `Sorry mate. You couldn't figure it out! Stick around to check if your opponent figures it out?`
          );
        }

        return;
      }

      this.rows[this.activeRowIndex] = [...updatedRow];
      this.keys = [...this.updateKeyboard(updatedRow)];

      this.activeRowIndex++;
      this.activeColumnIndex = 0;
      this.enableKeys();
      return;
    } catch (err) {
      this.showAlert(err.message);
    }
  }

  private createUpdatedRow(
    rowResponse: ('valid' | 'invalid' | 'mispositioned')[],
    word: string
  ): LetterType[] {
    return rowResponse.map((state, i) => ({
      state,
      character: word[i],
    }));
  }

  handleBackspaceKey() {
    this.enableKeys();
    if (this.activeColumnIndex === 0) {
      return;
    }
    this.activeColumnIndex--;
    this.rows[this.activeRowIndex][this.activeColumnIndex].character = '';
    return;
  }

  onClickKey(key: string) {
    this.onKeyUp({ key } as unknown as KeyboardEvent);
  }

  private pollOpponentStatus() {
    this.opponentPollingInterval = setInterval(async () => {
      const { gameStatus, playerStatuses, wordle } =
        await this.gameService.getOpponentStatus(this.opponentId);
      if (gameStatus === 'finished' && wordle) {
        this.gameOver = true;
        this.showFinishAlert(
          'Opponent has won the game! The correct word was ' + wordle
        );
        clearInterval(this.opponentPollingInterval);
        this.opponentPollingInterval = null;
      }
      this.setOpponentRows(playerStatuses, this.opponentRows);
      this.ref.detectChanges();
      console.log(this.opponentRows);
    }, 3000);
  }

  private updateKeyboard(updatedRow: LetterType[]) {
    const newKeys = [...this.keys];
    for (let i = 0; i < this.keys.length; i++) {
      for (let j = 0; j < this.keys[i].length; j++) {
        const foundLetter = updatedRow.find(
          (l) =>
            l.character.toLowerCase() === newKeys[i][j].character.toLowerCase()
        );
        if (foundLetter) {
          if (
            foundLetter.state === 'invalid' &&
            newKeys[i][j].state !== 'empty'
          ) {
            continue;
          }
          newKeys[i][j].state = foundLetter.state;
        }
      }
    }
    return newKeys;
  }

  enableKeys() {
    this.areKeysEnabled = true;
  }

  disableKeys() {
    this.areKeysEnabled = false;
  }

  private async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
          handler: this.enableKeys.bind(this),
        },
      ],
    });
    alert.present();
  }

  private async showLoader(message: string) {
    const loader = await this.loadingCtrl.create({
      message,
    });
    this.loaderId = loader.id;
    loader.present();
  }

  private async hideLoader() {
    if (this.loaderId) {
      this.loadingCtrl.dismiss(this.loaderId);
      this.loaderId = '';
    }
  }

  private createConfirm(message: string): Promise<boolean> {
    return new Promise((res) => {
      const alert = this.alertCtrl.create({
        message,
        buttons: [
          {
            text: 'No',
            handler: () => res(false),
          },
          {
            text: 'Yes',
            handler: () => res(true),
          },
        ],
      });
      alert.then((al) => al.present());
    });
  }
  private showFinishAlert(message: string) {
    const alert = this.alertCtrl.create({
      message,
      buttons: [
        {
          text: 'Back Home',
          handler: () => this.router.navigate(['/landing']),
        },
      ],
    });
    alert.then((al) => al.present());
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Cleared');
  }
}
