import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailSeriesComponent } from './components/detail-series/detail-series.component';
import { HomeComponent } from './components/home/home.component';
import { SeriesComponent } from './components/admin/series/series.component';
import { SuperAdminGuard } from './guards/superAdmin/super-admin.guard';
import { EpisodeComponent } from './components/admin/episode/episode.component';
import { ActorComponent } from './components/admin/actor/actor.component';
import { CharacterComponent } from './components/admin/character/character.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { CategoryComponent } from './components/admin/category/category.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin', canActivate: [SuperAdminGuard], children: [
      { path: 'series', component: SeriesComponent, },
      { path: 'episodes', component: EpisodeComponent },
      { path: 'actor', component: ActorComponent },
      { path: 'character', component: CharacterComponent },
      { path: 'category', component: CategoryComponent }
    ]
  },
  { path: 'detail/series/:id', component: DetailSeriesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
