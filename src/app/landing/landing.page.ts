import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router,
    private modalController: ModalController
  ) {
    this.userId = userService.getCurrentUserId();
  }

  onPlayOnline() {
    this.gameService.setGameMode(GameMode.online);
    this.router.navigate(['/game']);
  }

  onPlaySolo() {
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
}
