import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailSeriesComponent } from './components/detail/detail-series/detail-series.component';
import { SearchComponent } from './components/search/search.component';
import { SeriesComponent } from './components/admin/series/series.component';
import { EpisodeComponent } from './components/admin/episode/episode.component';
import { ActorComponent } from './components/admin/actor/actor.component';
import { CharacterComponent } from './components/admin/character/character.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'detail/series/:id', component: DetailSeriesComponent },
    { path: 'search', component: SearchComponent },
    {
        path: 'admin', children: [
            { path: 'series', component: SeriesComponent },
            { path: 'episodes', component: EpisodeComponent },
            { path: 'actors', component: ActorComponent },
            { path: 'characters', component: CharacterComponent }
        ]
    }
];
