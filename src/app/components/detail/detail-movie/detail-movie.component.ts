import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { Movie } from '../../../models/movie.model';
import { ApiService } from '../../../service/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { mergeMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { Character } from '../../../models/character.model';
import { Actor } from '../../../models/actor.model';

@Component({
  selector: 'app-detail-movie',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './detail-movie.component.html',
  styleUrl: './detail-movie.component.css'
})
export class DetailMovieComponent implements OnInit {

  movie: Movie = new Movie()
  characters: Character[] = []

  constructor(private service: ApiService,
    @Inject(LOCALE_ID) public locale: string,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap(paramMap => {
        return this.service.getById<Movie>('movie', Number.parseInt(paramMap.get('id')!))
      }),
      mergeMap(movieDTO => {
        this.movie = movieDTO
        return this.service.getByIds<Character>('character', movieDTO.characterIds)
      }),
      mergeMap(charactDTOS => {
        this.characters = charactDTOS
        return this.service.getByIds<Actor>('actor', charactDTOS.map(c => c.actorId))
      })
    ).subscribe(actorDTOS => {
      this.characters.forEach(character => {
        character['actor'] = actorDTOS.find(a => a.id == character.actorId)
      })
    })
  }
}
