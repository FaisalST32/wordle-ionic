import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
})
export class RowComponent {
  @Input() letters: LetterType[] = [];
  @Input() displayOnly?: boolean = false;
  @Input() showBusy?: boolean = false;
  trackByIndex = (index: number, item: LetterType) => index;
}

export type LetterType = {
  character: string;
  state: LetterStates;
};

export type LetterStates = 'valid' | 'invalid' | 'mispositioned' | 'empty';
