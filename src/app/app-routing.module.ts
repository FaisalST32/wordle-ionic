import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { JoinGameGuard } from './guards/join-game.guard';
import { OnlineSelectorPage } from './online-selector/online-selector.page';

const routes: Routes = [
  {
    path: 'game',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingPageModule),
  },
  {
    path: 'online',
    component: OnlineSelectorPage,
  },
  {
    path: 'join/:gameCode',
    component: OnlineSelectorPage,
    canActivate: [JoinGameGuard],
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
