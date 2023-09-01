import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailSeriesComponent } from './components/detail-series/detail-series.component';
import { HomeComponent } from './components/home/home.component';
import { SeriesComponent } from './components/admin/series/series.component';
import { SuperAdminGuard } from './guards/superAdmin/super-admin.guard';
import { EpisodeComponent } from './components/admin/episode/episode.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin', canActivate: [SuperAdminGuard], children: [
      { path: 'series', component: SeriesComponent, },
      { path: 'episodes', component: EpisodeComponent }
    ]
  },
  { path: 'detail/series/:id', component: DetailSeriesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
