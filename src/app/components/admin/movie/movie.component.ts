import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Movie } from 'src/app/models/movie.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movies: Movie[] = []
  columns = ['name', 'releaseDate', 'action']

  formMovie=new FormGroup({
    
  })

  constructor(private service: ApiService<Movie>, @Inject(LOCALE_ID) public locale: string) { }
  ngOnInit(): void {
    this.service.getAll('movie').subscribe((dtos: Movie[]) => {
      this.movies = dtos
    })
  }

  populate(movie: Movie) {

  }

  deletes(movie: Movie) {

  }
}
