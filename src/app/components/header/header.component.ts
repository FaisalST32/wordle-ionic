import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: ` <div class="root">WORDLE</div> `,
  styles: [
    `
      .root {
        color: white;
        font-size: 25px;
        text-align: center;
        padding: 10px 0 25px 0;
      }
    `,
  ],
})
export class HeaderComponent {}
