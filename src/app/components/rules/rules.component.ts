import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LetterType } from '../row/row.component';

@Component({
  selector: 'app-rules-modal',
  template: `
    <div class="root">
      <div class="title">
        <span>How to Play</span>
        <ion-button (click)="dismiss()" fill="clear" size="small">
          <ion-icon slot="icon-only" name="close-outline"></ion-icon>
        </ion-button>
      </div>

      <p>Guess the WORD in 6 tries.</p>
      <p>
        Each guess must be a valid 5 letter word. Hit the enter button to
        submit.
      </p>
      <p>
        After each guess, the color of the tiles will change to show how close
        your guess was to the word.
      </p>
      <hr />
      <h5>For example</h5>
      <p>If the WORD is <strong>CARES</strong></p>
      <p>If the WORD is <strong>CARES</strong></p>
      <app-row [letters]="firstRow"></app-row>
      <p>
        The letters <strong>A</strong> and <strong>E</strong> are in the word
        but in the wrong spot. Rest of the letters are not in the word.
      </p>

      <app-row [letters]="secondRow"></app-row>
      <p>
        The letters <strong>A</strong> and <strong>E</strong> are in the word
        and in the right spot
      </p>
    </div>
  `,
  styles: [
    `
      .root {
        padding: 20px;
        color: white;
      }
      p {
        margin: 20px 0;
        font-size: 1rem;
        color: white;
      }
      ion-button {
        position: absolute;
        top: 15px;
        right: 0;
      }
      .title {
        font-size: 1.4rem;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        font-weight: bold;
        margin-bottom: 25px;
      }
      .title span {
        flex-grow: 1;
        text-align: center;
        position: relative;
      }
    `,
  ],
})
export class RulesModalComponent {
  readonly firstRow: LetterType[] = [
    { character: 'B', state: 'invalid' },
    { character: 'R', state: 'invalid' },
    { character: 'A', state: 'mispositioned' },
    { character: 'V', state: 'invalid' },
    { character: 'E', state: 'mispositioned' },
  ];
  readonly secondRow: LetterType[] = [
    { character: 'F', state: 'invalid' },
    { character: 'A', state: 'valid' },
    { character: 'M', state: 'invalid' },
    { character: 'E', state: 'valid' },
    { character: 'D', state: 'invalid' },
  ];
  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
