import { Component, Input } from '@angular/core';
import { LetterType } from '../row/row.component';

@Component({
  selector: 'app-opponent-board',
  template: `
    <div style="transform: scale(0.5); transform-origin: top;">
      <app-row [letters]="row" *ngFor="let row of rows"></app-row>
    </div>
  `,
})
export class OpponentBoardComponent {
  @Input() rows: LetterType[][];
}
