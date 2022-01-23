import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LetterStates, LetterType } from '../components/row/row.component';
import { RulesModalComponent } from '../components/rules/rules.component';
import { GameMode, GameService } from '../services/game.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  userId = '';

  titleRows: LetterType[][] = [
    [
      { character: 'W', state: 'empty' },
      { character: 'O', state: 'empty' },
      { character: 'R', state: 'empty' },
      { character: 'D', state: 'empty' },
      { character: 'L', state: 'empty' },
      { character: 'E', state: 'empty' },
    ],
    [
      { character: 'O', state: 'empty' },
      { character: 'N', state: 'empty' },
      { character: 'L', state: 'empty' },
      { character: 'I', state: 'empty' },
      { character: 'N', state: 'empty' },
      { character: 'E', state: 'empty' },
    ],
  ];

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private modalController: ModalController
  ) {
    this.userId = userService.getCurrentUserId();
    this.animateButtons();
  }

  onPlayOnline() {
    // this.gameService.setGameMode(GameMode.online);
    this.router.navigate(['/online']);
  }

  onPlaySolo() {
    this.gameService.setGameCode('');
    this.gameService.setGameMode(GameMode.solo);
    this.router.navigate(['/game']);
  }

  async onShowInstructions() {
    const modal = await this.modalController.create({
      component: RulesModalComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        firstName: 'Douglas',
        lastName: 'Adams',
        middleInitial: 'N',
      },
    });
    return await modal.present();
  }

  animateButtons() {
    const states: LetterStates[] = [
      'empty',
      'invalid',
      'mispositioned',
      'valid',
    ];
    setInterval(() => {
      const randomState: LetterStates =
        states[Math.floor(Math.random() * states.length)];
      const randomRow = Math.floor(Math.random() * 2);
      const randomCol = Math.floor(Math.random() * 6);
      this.titleRows[randomRow][randomCol].state = randomState;
    }, 200);
  }
}
