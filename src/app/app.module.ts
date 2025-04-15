import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainpageComponent } from './home/home.component';
import { IframepageComponent } from './iframe/iframe.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { ChessComponent } from './chess/chess.component';

@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    IframepageComponent,
    ChessComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgxChessBoardModule.forRoot()],
  bootstrap: [AppComponent],
})
export class AppModule {}
