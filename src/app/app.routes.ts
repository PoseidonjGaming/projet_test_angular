import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailSeriesComponent } from './components/detail/detail-series/detail-series.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'detail/series/:id', component: DetailSeriesComponent },
    { path: 'search', component: SearchComponent }
];
