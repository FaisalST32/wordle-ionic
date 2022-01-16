/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LetterType } from '../components/row/row.component';
import { GameMode, GameService } from '../services/game.service';
import { WordleService } from '../services/wordle.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  activeRowIndex = 0;
  activeColumnIndex = 0;
  rows: LetterType[][] = [];
  opponentRows: LetterType[][] = [];
  gameOver = false;
  hasGameStarted = false;
  gameMode: GameMode;
  opponentId: string;
  keys: LetterType[][] = generateInitialKeys();
  loaderId;
  // private wordle = '';

  constructor(
    private wordleService: WordleService,
    private alertCtrl: AlertController,
    private gameService: GameService,
    private loadingCtrl: LoadingController,
    private ref: ChangeDetectorRef,
    private router: Router
  ) {
    this.initializeGame();
  }

  async initializeGame() {
    await this.showLoader('Loading Game...');
    this.gameMode = this.gameService.getGameMode();
    if (this.gameMode === GameMode.online) {
      const newGame = await this.gameService.startNewOnlineGame();
      const { opponentId } = newGame;
      this.opponentId = opponentId;
      this.hasGameStarted = true;
      this.opponentRows = [
        generateEmptyRow(),
        generateEmptyRow(),
        generateEmptyRow(),
        generateEmptyRow(),
        generateEmptyRow(),
        generateEmptyRow(),
      ];
      this.pollOpponentStatus();
    } else {
      await this.gameService.startNewSoloGame();
    }
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
    this.hideLoader();
  }

  @HostListener('document:keydown', ['$event'])
  async onKeyUp(event: KeyboardEvent) {
    if (this.gameOver) {
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
      const currentRow = this.rows[this.activeRowIndex];
      const isCurrentRowFilled = this.rows[this.activeRowIndex].every(
        (letter) => letter.character !== ''
      );
      if (!isCurrentRowFilled) {
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
        // if (playAgain) {
        //   this.initializeGame();
        // } else {
        //   this.gameOver = true;
        // }
        return;
      }
      if (!hasWonGame && this.activeRowIndex === 5) {
        await this.showFinishAlert(
          `Sorry mate. The correct word was ${''}. Play again?`
        );
        // if (playAgain) {
        //   this.initializeGame();
        // } else {
        //   this.gameOver = true;
        // }
        return;
      }

      this.rows[this.activeRowIndex] = [...updatedRow];
      this.keys = [...this.updateKeyboard(updatedRow)];

      this.activeRowIndex++;
      this.activeColumnIndex = 0;
      return;
    } catch (err) {
      this.showAlert(err.response.error);
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
    const interval = setInterval(async () => {
      const { gameStatus, playerStatuses, wordle } =
        await this.gameService.getOpponentStatus(this.opponentId);
      if (gameStatus === 'finished') {
        this.gameOver = true;
        this.showAlert(
          'Opponent has won the game! The correct word was ' + wordle
        );
        clearInterval(interval);
      }
      this.opponentRows.forEach((row, i) => {
        if (playerStatuses[i]) {
          row.forEach((letter, j) => {
            letter.state = playerStatuses[i][j];
            letter.character = ' ';
          });
        }
      });
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

  private async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
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
    this.loadingCtrl.dismiss(this.loaderId);
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
}

const generateEmptyRow = (): LetterType[] => [
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
];

const generateInitialKeys = (): LetterType[][] => {
  const keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ];
  return keyRows.map((row) =>
    row.map((key) => ({
      character: key,
      state: 'empty',
    }))
  );
};
