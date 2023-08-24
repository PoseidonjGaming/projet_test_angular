import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailSeriesComponent } from './compo/detail-series/detail-series.component';

const routes: Routes = [
  { path: 'detail/:id', component: DetailSeriesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
