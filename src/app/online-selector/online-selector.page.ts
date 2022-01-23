import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonInput, LoadingController } from '@ionic/angular';
import { LetterType } from '../components/row/row.component';
import { GameMode, GameService } from '../services/game.service';
import { generateEmptyRow } from '../utils/data.utils';

@Component({
  templateUrl: './online-selector.page.html',
  styleUrls: ['./online-selector.page.css'],
})
export class OnlineSelectorPage {
  @ViewChild('codeInput') codeInput: IonInput;
  isEnteringGameCode = false;
  isCreatingGame = false;
  gameCodeRow: LetterType[] = generateEmptyRow();
  gameCode: string;

  constructor(
    private gameService: GameService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.onCancel();
      }
    });
  }

  onEnterGameCode() {
    this.isEnteringGameCode = true;
  }

  async onCreateNewGame() {
    let loader: HTMLIonLoadingElement;
    try {
      this.isCreatingGame = true;
      loader = await this.loadingCtrl.create({
        message: 'Creating game...',
      });
      await loader.present();
      const gameCode = await this.gameService.getNewGameCode();
      this.gameCode = gameCode;
      this.codeInput.value = gameCode;
      this.updateGameCodeRow();
      await loader.dismiss();
    } catch (err) {
      await loader.dismiss();
    }
  }
  onJoinAnyGame() {
    this.gameService.setGameCode('');
    this.gameService.setGameMode(GameMode.online);
    this.router.navigate(['/game']);
  }
  onCancel() {
    if (this.codeInput) {
      this.codeInput.value = '';
    }
    this.gameCode = '';
    this.isEnteringGameCode = false;
    this.isCreatingGame = false;
  }
  onConfirmGameCode() {
    this.gameService.setGameCode(this.gameCode);
    this.gameService.setGameMode(GameMode.online);
    this.codeInput.value = '';
    this.gameCode = '';
    this.isEnteringGameCode = false;
    this.isCreatingGame = false;
    this.router.navigate(['/game']);
  }
  onChangeCode(e: any) {
    const newValue: string = e.target.value;
    if (!newValue) {
      this.gameCodeRow = generateEmptyRow();
      return;
    }

    this.gameCode = newValue;
    const isValidLetter =
      new RegExp(/^[a-zA-Z]+$/).test(newValue) && newValue.length <= 5;
    if (!isValidLetter) {
      this.gameCode = newValue.substring(0, newValue.length - 1);
    }
    this.codeInput.value = this.gameCode;
    this.updateGameCodeRow();
  }
  onGoBack() {
    this.onCancel();
    this.router.navigate(['/landing']);
  }

  updateGameCodeRow() {
    this.gameCodeRow.forEach((letter, i) => {
      if (!this.gameCode[i]) {
        letter.character = '';
        return;
      }
      letter.character = this.gameCode[i].toUpperCase();
    });
  }
}
