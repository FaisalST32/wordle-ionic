import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GameMode, GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root',
})
export class JoinGameGuard implements CanActivate {
  constructor(private gameService: GameService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const gameCode = next.params.gameCode;
    if (!gameCode) {
      this.router.navigate(['/landing']);
      return false;
    }
    this.gameService.setGameCode(gameCode);
    this.gameService.setGameMode(GameMode.online);
    this.router.navigate(['/game']); // go to login if not authenticated
    return false;
  }
}
