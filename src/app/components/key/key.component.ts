import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LetterStates } from '../row/row.component';

@Component({
  selector: 'app-key',
  template: `
    <div
      [class]="state"
      [class.tile]="true"
      [class.front]="true"
      [class.filled]="!!character.length"
      (click)="onClickKey(character)"
    >
      {{ character }}
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: sans-serif;
        font-weight: bold;
        border: solid #ccc 1px;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
        width: auto;
        height: 40px;
      }
      .valid {
        background-color: green;
      }
      .invalid {
        background-color: #3a3a3c;
      }
      .mispositioned {
        background-color: #b59f3b;
      }
      div:active {
        background-color: lightgray;
      }
    `,
  ],
})
export class KeyComponent {
  @Input() state: LetterStates = 'valid';
  @Input() character = '';
  @Output() clicked: EventEmitter<string> = new EventEmitter();

  onClickKey(key: string) {
    this.clicked.emit(key);
  }
}
