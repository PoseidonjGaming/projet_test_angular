import { Routes } from '@angular/router';
import { DetailSeriesComponent } from './components/detail/detail-series/detail-series.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { authGuard } from './guard/auth/auth.guard';
import { RegistrationComponent } from './components/registration/registration.component';
import { WatchlistComponent } from './components/user/watchlist/watchlist.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { adminGuard } from './guard/admin/admin.guard';
import { DetailMovieComponent } from './components/detail/detail-movie/detail-movie.component';
import { DetailActorComponent } from './components/detail/detail-actor/detail-actor.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },

    {
        path: 'detail', children: [
            { path: 'series/:id', component: DetailSeriesComponent },
            { path: 'movie/:id', component: DetailMovieComponent },
            { path: 'actor/:id', component: DetailActorComponent }
        ]
    },
    { path: 'search', component: SearchComponent },
    { path: 'registrate', component: RegistrationComponent },
    {
        path: 'user', canActivate: [authGuard], children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'watchlist', component: WatchlistComponent }
        ]
    },
    { path: 'admin/:type', canActivate: [adminGuard], component: AdminComponent }
];
