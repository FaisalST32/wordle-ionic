import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
})
export class RowComponent {
  @Input() letters: LetterType[] = [];
}

export type LetterType = {
  character: string;
  state: 'valid' | 'invalid' | 'mispositioned' | 'empty';
};
