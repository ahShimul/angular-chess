import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './home/home.component';
import { ChessComponent } from './chess/chess.component';

const routes: Routes = [
  { path: 'mainpage', component: MainpageComponent },
  { path: 'iframepage', component: ChessComponent },
  { path: '', redirectTo: 'mainpage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
