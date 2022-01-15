/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, HostListener } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LetterType } from '../components/row/row.component';
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
  gameOver = false;
  keys: LetterType[][] = generateInitialKeys();
  private wordle = '';

  constructor(
    private wordleService: WordleService,
    private alertCtrl: AlertController
  ) {
    this.initializeGame();
  }

  initializeGame() {
    this.wordle = this.wordleService.generateWordle();
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
  }

  @HostListener('document:keydown', ['$event'])
  async onKeyUp(event: KeyboardEvent) {
    if (this.gameOver) {
      return;
    }
    const keyPressed = event.key;
    const isAlphabetKey: boolean = new RegExp(/^[a-z]$/).test(keyPressed);
    if (isAlphabetKey && this.activeColumnIndex < 5) {
      this.rows[this.activeRowIndex][this.activeColumnIndex].character =
        event.key.toUpperCase();
      this.activeColumnIndex++;
      return;
    }
    const isEnterKey = keyPressed.toLowerCase() === 'enter';
    if (isEnterKey) {
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
      const isValidWord = await this.wordleService.checkIfWordExists(word);
      if (!isValidWord) {
        this.showAlert('invalid word try again');
        return;
      }

      const updatedRow = this.validateLetters(currentRow, this.wordle);
      const hasWonGame: boolean = updatedRow.every(
        (letter) => letter.state === 'valid'
      );
      if (hasWonGame) {
        const playAgain: boolean = await this.createConfirm(
          'Yay! You have won. Play again?'
        );
        if (playAgain) {
          this.initializeGame();
        } else {
          this.gameOver = true;
        }
        return;
      }
      if (!hasWonGame && this.activeRowIndex === 5) {
        const playAgain: boolean = await this.createConfirm(
          `Sorry mate. The correct word was ${this.wordle}. Play again?`
        );
        if (playAgain) {
          this.initializeGame();
        } else {
          this.gameOver = true;
        }
        return;
      }

      this.rows[this.activeRowIndex] = [...updatedRow];
      this.keys = [...this.updateKeyboard(updatedRow)];

      this.activeRowIndex++;
      this.activeColumnIndex = 0;
      return;
    }

    const isBackspaceKey = keyPressed.toLowerCase() === 'backspace';
    if (isBackspaceKey) {
      if (this.activeColumnIndex === 0) {
        return;
      }
      this.activeColumnIndex--;
      this.rows[this.activeRowIndex][this.activeColumnIndex].character = '';
      return;
    }
  }

  onClickKey(key: string) {
    this.onKeyUp({ key } as unknown as KeyboardEvent);
  }

  validateLetters(rowToValidate: LetterType[], wordle: string): LetterType[] {
    const wordleArray: string[] = wordle.split('');
    const updatedRow: LetterType[] = [...rowToValidate];
    for (let i = 0; i < updatedRow.length; i++) {
      if (updatedRow[i].character === wordleArray[i]) {
        updatedRow[i].state = 'valid';
        wordleArray[i] = '0';
      }
    }
    for (let i = 0; i < updatedRow.length; i++) {
      if (
        updatedRow[i].state === 'empty' &&
        wordleArray.includes(updatedRow[i].character)
      ) {
        updatedRow[i].state = 'mispositioned';
        wordleArray[wordleArray.indexOf(updatedRow[i].character)] = '0';
      }
    }
    for (let i = 0; i < updatedRow.length; i++) {
      if (updatedRow[i].state === 'empty') {
        updatedRow[i].state = 'invalid';
      }
    }
    return updatedRow;
  }

  updateKeyboard(updatedRow: LetterType[]) {
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

  async showAlert(message: string) {
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

  createConfirm(message: string): Promise<boolean> {
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
