import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { GameMode, GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private deeplinks: Deeplinks,
    private router: Router,
    private zone: NgZone,
    private gamesService: GameService
  ) {
    this.initDeeplinks();
  }
  initDeeplinks() {
    this.deeplinks.route({ '/join/:code': 'join' }).subscribe(
      (match) => {
        // const path = `/${match.$route}/${match.$args.code}`;
        const gameCode = match.$args.code;
        this.gamesService.setGameCode(gameCode);
        this.gamesService.setGameMode(GameMode.online);
        // Run the navigation in the Angular zone
        this.zone.run(() => {
          this.router.navigate(['/game']);
        });
      },
      (nomatch) => {
        console.log(`Deeplink that didn't match`, nomatch);
      }
    );
  }
}
