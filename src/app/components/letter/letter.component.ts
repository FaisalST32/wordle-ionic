import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LetterStates } from '../row/row.component';

@Component({
  selector: 'app-letter',
  template: `
    <div
      [class]="state"
      [class.key]="isKey"
      [class.tile]="true"
      (click)="onClickKey(character)"
    >
      {{ character }}
    </div>
  `,
  styles: [
    `
      div {
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: white;
        font-family: sans-serif;
        font-weight: bold;
        border: solid #ccc 1px;
        transition: all 200ms ease-out;
      }
      .valid {
        background-color: green;
      }
      .invalid {
        background-color: gray;
      }
      .mispositioned {
        background-color: #b59f3b;
      }
      .empty {
        /* background-color: #000; */
      }
      .key {
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
        /* min-width: 10px; */
        width: auto;
        height: 40px;
        transition: none;
      }
      .key:active {
        background-color: lightgray;
      }
    `,
  ],
})
export class LetterComponent {
  @Input() state: LetterStates = 'valid';
  @Input() character = '';
  @Input() isKey?: boolean = false;
  @Output() clicked: EventEmitter<string> = new EventEmitter();

  onClickKey(key: string) {
    this.clicked.emit(key);
  }
}
