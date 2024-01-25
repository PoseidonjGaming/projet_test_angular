import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Sorter } from '../../models/sorter.model';
import { MatchMode } from '../../models/enum/matchMode.model';
import { StringMatcher } from '../../models/enum/stringMatcher.model';
import { Movie } from '../../models/movie.model';
import { Series } from '../../models/series.model';
import { User } from '../../models/user.model';
import { ApiService } from '../../service/api/api.service';
import { TokenService } from '../../service/api/token/token.service';
import { MenuComponent } from '../menu/menu.component';
import { ApiUserService } from '../../service/api/user/api-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MenuComponent,
    MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  series: Series[] = []
  movies: Movie[] = []
  slicedsummary: boolean = true;
  isLogged: boolean = false
  private seriesIds: number[] = []
  private moviesIds: number[] = []


  constructor(private service: ApiUserService,
    private tokenService: TokenService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    if (this.tokenService.isExist()) {
      this.service.getByUsername().subscribe((userDTOS: User) => {
        if (userDTOS) {
          this.seriesIds = userDTOS.seriesIds
        }
      })
    }
    combineLatest([
      this.service.sort<Series>('series', 'id', Sorter.DESC),
      this.service.sort<Movie>('movie', 'id', Sorter.DESC)
    ]).subscribe(([seriesDTOS, movieDTOS]) => {
      this.series = seriesDTOS
      this.movies = movieDTOS
    })
  }

  getLog(event: boolean) {
    this.isLogged = event
  }

  isInWatchlistSeries(id: number): string {
    return (this.seriesIds.includes(id)) ? 'bookmark' : 'bookmark_border'
  }

  isInWatchlistMovie(id: number) {
    return (this.moviesIds.includes(id)) ? 'bookmark' : 'bookmark_border'
  }

  updateBookmark(id: number, watchlist: string) {
    const type = (watchlist === 'series') ? 'Série' : 'Film'
    if (!this.includes((watchlist === 'series') ? this.seriesIds : this.moviesIds, id)) {
      this.service.addToWatchlist(id, watchlist).subscribe((ids: number[]) => {
        if (watchlist === 'series')
          this.seriesIds = ids
        else
          this.moviesIds = ids
        this.snack.open(`${type} ajoutée à la watchlist de ${this.tokenService.getUsername()}`,
          "Fermer", { duration: 5 * 1000 })
      })
    } else {
      this.service.removeFromWatchlist(id, watchlist).subscribe((ids: number[]) => {
        if (watchlist === 'series')
          this.seriesIds = ids
        else
          this.moviesIds = ids
        this.snack.open(`${type} retirée de la watchlist de ${this.tokenService.getUsername()}`,
          "Fermer", { duration: 5 * 1000 })
      })
    }

  }

  private includes(ids: number[], id: number) {
    return ids.includes(id)
  }
}
