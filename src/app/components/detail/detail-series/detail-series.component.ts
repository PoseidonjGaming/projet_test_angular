import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, combineLatest, mergeMap, switchMap } from 'rxjs';
import { Actor } from 'src/app/models/actor.model';
import { Character } from 'src/app/models/character.model';
import { Episode } from 'src/app/models/episode.model';
import { Season } from 'src/app/models/season.model';
import { Series } from 'src/app/models/series.model';
import { ApiActorService } from 'src/app/service/actor/api-actor.service';
import { ApiCharacterService } from 'src/app/service/character/api-character.service';
import { ApiEpisodeService } from 'src/app/service/episode/api-episode.service';
import { ApiSeasonService } from 'src/app/service/season/api-season.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';

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

  constructor(private service: ApiSeriesService,
    private seasonService: ApiSeasonService,
    private episodeService: ApiEpisodeService,
    private characterService: ApiCharacterService,
    private actorService: ApiActorService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) public locale: string) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id')
      if (id) {
        this.service.getById<Series>(id).pipe(
          switchMap((dto: Series) => {
            this.series = dto
            console.log(this.series.seasonIds);
            
            return combineLatest([
              this.seasonService.getByIds<Season>(dto.seasonIds),
              this.characterService.getByIds<Character>(dto.characterIds)
            ])
          }),
          switchMap(([seasonDtos, characterDtos]) => {
            this.characters = characterDtos

            return combineLatest([
              this.actorService.getByIds<Actor>(characterDtos.map(e => e.actorId)),
              this.episodeService.getByIds<Episode>(seasonDtos.map(e => e.episodeIds).flat())
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
