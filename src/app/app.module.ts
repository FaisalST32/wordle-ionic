import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';
import { OnlineSelectorPage } from './online-selector/online-selector.page';
import { FormsModule } from '@angular/forms';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

@NgModule({
  declarations: [AppComponent, OnlineSelectorPage],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Clipboard,
    Deeplinks,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
