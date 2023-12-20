import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailActorComponent } from './components/detail/detail-actor/detail-actor.component';
import { DetailSeriesComponent } from './components/detail/detail-series/detail-series.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { SuperAdminGuard } from './guards/superAdmin/super-admin.guard';
import { SeriesComponent } from './components/admin/series/series.component';
import { EpisodeComponent } from './components/admin/episode/episode.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin', canActivate: [SuperAdminGuard], children: [
      { path: 'series', component: SeriesComponent },
      { path: 'episodes', component: EpisodeComponent }
    ]
  },
  {
    path: 'detail', children: [
      { path: 'series/:id', component: DetailSeriesComponent },
      { path: 'actor/:id', component: DetailActorComponent }
    ]
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
