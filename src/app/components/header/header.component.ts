import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: ` <div class="root" [routerLink]="['/landing']">WORDLR</div> `,
  styles: [
    `
      .root {
        color: white;
        font-size: 25px;
        font-weight: bold;
        cursor: 'pointer';
        text-align: center;
        padding: 10px 0 25px 0;
      }
    `,
  ],
})
export class HeaderComponent {}
