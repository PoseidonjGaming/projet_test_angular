import { DatePipe } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Actor } from '../../../models/actor.model';
import { Character } from '../../../models/character.model';
import { Episode } from '../../../models/episode.model';
import { Season } from '../../../models/season.model';
import { Series } from '../../../models/series.model';
import { ApiService } from '../../../service/api/api.service';
import { MenuComponent } from '../../menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-detail-series',
  standalone: true,
  imports: [MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    RouterLink,
    MenuComponent,
    DatePipe],
  templateUrl: './detail-series.component.html',
  styleUrl: './detail-series.component.css'
})
export class DetailSeriesComponent {

  @Input()
  set id(seriesId: string) {
    this.service.getById<Series>('series', Number.parseInt(seriesId)).subscribe((dto: Series) => {
      this.series = dto
    })
  }

  series: Series = new Series()
  seasons: Season[] = []
  characters: Character[] = []
  actors: Actor[] = []


  constructor(private service: ApiService, @Inject(LOCALE_ID) public locale: string) { }
  ngOnInit(): void {
    combineLatest([
      this.service.getByIds<Season>('season', this.series.seasonIds),
      this.service.getByIds<Character>('character', this.series.characterIds)
    ]).pipe(
      switchMap(([seasonDtos, characterDtos]) => {        
        this.characters = characterDtos
        this.seasons = seasonDtos
        return combineLatest([
          this.service.getByIds<Actor>('actor', characterDtos.map(e => e.actorId)),
          this.service.getByIds<Episode>('episode', seasonDtos.map(e => e.episodeIds).flat())
        ])
      })
    ).subscribe(([actorDtos, episodeDtos]) => {
      this.seasons.forEach(season => {
        season['episodes'] = episodeDtos.filter(e => e.seasonId == season.id)
      })

      this.characters.forEach(character => {
        character['actor'] = actorDtos.find(a => a.id == character.actorId)
      })

    })

  }
}
