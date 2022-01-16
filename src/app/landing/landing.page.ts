import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
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
}
