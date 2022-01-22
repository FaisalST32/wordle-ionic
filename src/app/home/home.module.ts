import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { KeyboardComponent } from '../components/keyboard/keyboard.component';
import { HeaderComponent } from '../components/header/header.component';
import { OpponentBoardComponent } from '../components/opponent-board/opponent-board.component';
import { RulesModalComponent } from '../components/rules/rules.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomePage,
    KeyboardComponent,
    HeaderComponent,
    OpponentBoardComponent,
    RulesModalComponent,
  ],
})
export class HomePageModule {}
