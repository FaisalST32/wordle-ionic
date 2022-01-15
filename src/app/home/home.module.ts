import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LetterComponent } from '../components/letter/letter.component';
import { RowComponent } from '../components/row/row.component';
import { KeyboardComponent } from '../components/keyboard/keyboard.component';
import { HeaderComponent } from '../components/header/header.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    LetterComponent,
    RowComponent,
    KeyboardComponent,
    HeaderComponent,
  ],
})
export class HomePageModule {}
