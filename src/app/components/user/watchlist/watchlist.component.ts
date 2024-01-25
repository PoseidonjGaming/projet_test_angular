import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TokenService } from '../../../service/api/token/token.service';
import { ApiService } from '../../../service/api/api.service';
import { User } from '../../../models/user.model';
import { MatchMode } from '../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../models/enum/StringMatcher.model';
import { combineLatest, mergeMap, switchMap } from 'rxjs';
import { Series } from '../../../models/series.model';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ApiUserService } from '../../../service/api/user/api-user.service';
import { Base } from '../../../models/base.model';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {

  watchlist: Base[] = []

  constructor(private service: ApiUserService, private tokenService: TokenService) { }


  ngOnInit(): void {
    this.service.getByUsername().pipe(
      switchMap((userDTOS: User) => {
        return combineLatest([
          this.service.getByIds<Series>('series', userDTOS.seriesIds),
          this.service.getByIds<Movie>('movie', userDTOS.movieIds)
        ])
      })

    ).subscribe(dtos => {
      this.watchlist = dtos.flat()

    })
  }

}
