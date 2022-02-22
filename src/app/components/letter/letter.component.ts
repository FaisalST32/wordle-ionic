import { Component, Input } from '@angular/core';
import { LetterStates } from '../row/row.component';

@Component({
  selector: 'app-letter',
  template: `
    <div
      [class]="state"
      [class.tile]="true"
      [class.front]="true"
      [class.filled]="!!character.length"
      [class.noAnimation]="noAnimation"
      [class.isLoading]="isLoading"
    >
      {{ character }}
    </div>
    <div
      [class]="state"
      [class.tile]="true"
      [class.noAnimation]="noAnimation"
      [class.back]="true"
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
        transition: all 1000ms ease-out;
        position: relative;
        transition-delay: inherit;
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
      .back {
        margin-top: -50px;
        transform: rotateX(180deg);
        backface-visibility: hidden;
      }
      .back.back.back.back:not(.empty) {
        transform: rotateX(360deg);
        animation: none;
      }
      .front.front {
        transform: rotateX(0deg);
        backface-visibility: hidden;
        background-color: transparent;
      }
      .front.front.front.front:not(.empty) {
        transform: rotateX(180deg);
        animation: none;
      }
      .front.filled:not(.isLoading, .noAnimation) {
        animation: pulse 200ms linear 0s 1;
      }
      .noAnimation.noAnimation {
        transition: none;
        animation: none;
      }
      .isLoading {
        animation: colors 1000ms linear 0s infinite;
      }
    `,
  ],
})
export class LetterComponent {
  @Input() state: LetterStates = 'valid';
  @Input() character = '';
  @Input() noAnimation?: boolean = false;
  @Input() isLoading?: boolean = false;
}
