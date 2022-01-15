import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-letter',
  template: `
    <div [class]="state" [class.key]="isKey" (click)="onClickKey(character)">
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
      }
    `,
    `
      .valid {
        background-color: green;
      }
    `,
    `
      .invalid {
        background-color: gray;
      }
    `,
    `
      .mispositioned {
        background-color: #b59f3b;
      }
    `,
    `
      .empty {
        /* background-color: #000; */
      }
    `,
    `
      .key {
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
        /* min-width: 10px; */
        width: auto;
        height: 40px;
        /* padding: 0px 7px; */
      }
      .key:active {
        background-color: lightgray;
      }
    `,
  ],
})
export class LetterComponent {
  @Input('state') state: 'valid' | 'invalid' | 'mispositioned' | 'empty' =
    'valid';
  @Input('character') character: string = '';
  @Input() isKey?: boolean = false;
  @Output() clicked: EventEmitter<string> = new EventEmitter();

  onClickKey(key: string) {
    console.log('clicking');
    this.clicked.emit(key);
  }
}
