import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Series } from '../../models/series.model';
import { ApiService } from '../../service/api/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from '../menu/menu.component';
import { combineLatest } from 'rxjs';
import { Base } from '../../models/base.model';
import { Sorter } from '../../models/Sorter.model';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink, MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  series: Series[] = []
  movies: Movie[] = []
  slicedsummary: boolean = true;


  constructor(private service: ApiService) { }

  ngOnInit(): void {
    combineLatest([
      this.service.sort<Series>('series', 'id', Sorter.DESC),
      this.service.sort<Movie>('movie', 'id', Sorter.DESC)
    ]).subscribe(([seriesDTOS, movieDTOS]) => {
      this.series = seriesDTOS
      this.movies = movieDTOS
    })

    // if (this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
    //   this.tokenService.deleteToken()
    // }
  }
}
