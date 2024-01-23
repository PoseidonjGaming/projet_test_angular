import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Sorter } from '../../models/Sorter.model';
import { MatchMode } from '../../models/enum/MatchMode.model';
import { StringMatcher } from '../../models/enum/StringMatcher.model';
import { Movie } from '../../models/movie.model';
import { Series } from '../../models/series.model';
import { User } from '../../models/user.model';
import { ApiService } from '../../service/api/api.service';
import { TokenService } from '../../service/api/token/token.service';
import { MenuComponent } from '../menu/menu.component';
import { ApiUserService } from '../../service/api/user/api-user.service';

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


  constructor(private service: ApiUserService,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.tokenService.isExist()) {
      this.service.search<User>('user', { username: this.tokenService.getUsername() },
        MatchMode.ALL, StringMatcher.EXACT, null, null).subscribe((userDTOS: User[]) => {
          if (userDTOS[0]) {
            this.seriesIds = userDTOS[0].seriesIds
            console.log(userDTOS[0]);
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

  isInWatchlist(id: number): string {
    return (this.seriesIds.includes(id)) ? 'bookmark' : 'bookmark_border'
  }

  updateBookmark(id: number) {
    if (!this.seriesIds.includes(id)) {
      this.service.addToWatchlist(id).subscribe((seriesDTOS: Series[]) => {
        this.seriesIds = seriesDTOS.map(s => s['id'])
      })
    }else {

    }

  }
}
