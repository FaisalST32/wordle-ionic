import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KeyComponent } from './components/key/key.component';
import { LetterComponent } from './components/letter/letter.component';
import { RowComponent } from './components/row/row.component';

@NgModule({
  declarations: [RowComponent, LetterComponent, KeyComponent],
  imports: [CommonModule],
  exports: [RowComponent, LetterComponent, KeyComponent],
})
export class SharedModule {}
