import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LetterComponent } from './components/letter/letter.component';
import { RowComponent } from './components/row/row.component';

@NgModule({
  declarations: [RowComponent, LetterComponent],
  imports: [CommonModule],
  exports: [RowComponent, LetterComponent],
})
export class SharedModule {}
