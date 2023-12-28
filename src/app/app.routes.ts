import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailSeriesComponent } from './components/detail/detail-series/detail-series.component';
import { SearchComponent } from './components/search/search.component';
import { SeriesComponent } from './components/admin/series/series.component';
import { EpisodeComponent } from './components/admin/episode/episode.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'detail/series/:id', component: DetailSeriesComponent },
    { path: 'search', component: SearchComponent },
    {
        path: 'admin', children: [
            { path: 'series', component: SeriesComponent },
            { path: 'episodes', component: EpisodeComponent }
        ]
    }
];
