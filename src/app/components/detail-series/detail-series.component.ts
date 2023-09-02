import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap } from 'rxjs';
import { Episode } from 'src/app/models/episode.model';
import { Season } from 'src/app/models/season.model';
import { Series } from 'src/app/models/series.model';
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

  constructor(private service: ApiSeriesService,
    private saisonService: ApiSeasonService,
    private episodeService: ApiEpisodeService,
    private route: ActivatedRoute,
    @Inject(LOCALE_ID) public locale: string) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id')

      if (id) {
        this.service.getById('series', id).pipe(
          mergeMap((d: Series) => {
            this.series = d
            return this.saisonService.getBySeriesId(d.id.toString())
          }),
          mergeMap((d: Season[]) => {
            this.saisons = d
            return this.episodeService.betBySeasonIdIn(d.map(e => e.seriesId.toString()))
          })
        ).subscribe((d: Episode[]) => {
          for (let index = 0; index < this.saisons.length; index++) {
            let temp: Episode[] = []
            d.forEach((e: Episode) => {
              if (!temp.includes(e) && e.seasonId == this.saisons[index].id)
                temp.push(e)
            })
            this.episodes.push(temp)
          }
        })
      }
    })
  }
}
