import { Routes } from '@angular/router';
import { ActorComponent } from './components/admin/actor/actor.component';
import { CatagoryComponent } from './components/admin/catagory/catagory.component';
import { CharacterComponent } from './components/admin/character/character.component';
import { EpisodeComponent } from './components/admin/episode/episode.component';
import { MovieComponent } from './components/admin/movie/movie.component';
import { SeriesComponent } from './components/admin/series/series.component';
import { DetailSeriesComponent } from './components/detail/detail-series/detail-series.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { authGuard } from './guard/auth/auth.guard';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReviewComponent } from './components/admin/review/review.component';
import { WatchlistComponent } from './components/user/watchlist/watchlist.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { adminGuard } from './guard/admin/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'detail/series/:id', component: DetailSeriesComponent },
    { path: 'search', component: SearchComponent },
    { path: 'registrate', component: RegistrationComponent },
    {
        path: 'user', canActivate: [authGuard], children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'watchlist', component: WatchlistComponent }
        ]
    },
    {
        path: 'admin', canActivate: [adminGuard], children: [
            { path: 'series', component: SeriesComponent },
            { path: 'episodes', component: EpisodeComponent },
            { path: 'actors', component: ActorComponent },
            { path: 'characters', component: CharacterComponent },
            { path: 'movies', component: MovieComponent },
            { path: 'categories', component: CatagoryComponent },
            { path: 'reviews', component: ReviewComponent }
        ]
    }
];
