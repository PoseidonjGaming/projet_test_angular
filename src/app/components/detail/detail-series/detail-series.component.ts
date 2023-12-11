import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { Actor } from 'src/app/models/actor.model';
import { Character } from 'src/app/models/character.model';
import { Episode } from 'src/app/models/episode.model';
import { Season } from 'src/app/models/season.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-detail-series',
  templateUrl: './detail-series.component.html',
  styleUrls: ['./detail-series.component.css']
})
export class DetailSeriesComponent implements OnInit {
  series?: Series
  saisons: Season[] = []
  episodes: Episode[][] = []
  characters: Character[] = []
  actors: Actor[] = []

  constructor(private service: ApiService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) public locale: string) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id')
      if (id) {
        this.service.getById<Series>('series', Number.parseInt(id)).pipe(
          switchMap((dto: Series) => {
            this.series = dto
            console.log(this.series.seasonIds);

            return combineLatest([
              this.service.getByIds<Season>('season',dto.seasonIds),
              this.service.getByIds<Character>('character',dto.characterIds)
            ])
          }),
          switchMap(([seasonDtos, characterDtos]) => {
            this.characters = characterDtos

            return combineLatest([
              this.service.getByIds<Actor>('actor',characterDtos.map(e => e.actorId)),
              this.service.getByIds<Episode>('episode', seasonDtos.map(e => e.episodeIds).flat())
            ])
          })
        ).subscribe(([actorDtos, episodeDtos]) => {
          this.characters.forEach(character => {
            character.actor = actorDtos.find(e => e.id == character.actorId)
          })
          this.actors.find(e => e.id == 1)
          new Set(episodeDtos.map(e => e.seasonId)).forEach(s => {
            let temp: Episode[] = []
            episodeDtos.forEach(e => {
              if (e.seasonId == s) {
                temp.push(e)
              }
            })
            this.episodes.push(temp)
          })

        })
      }
    })
  }
}
