import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mergeMap } from 'rxjs';
import { Episode } from 'src/app/models/episode.model';
import { Saison } from 'src/app/models/saison.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';
import { ApiEpisodeService } from 'src/app/service/episode/api-episode.service';
import { ApiSaisonService } from 'src/app/service/saison/api-saison.service';

@Component({
  selector: 'app-detail-series',
  templateUrl: './detail-series.component.html',
  styleUrls: ['./detail-series.component.css']
})
export class DetailSeriesComponent implements OnInit {
  series?: Series
  saisons: Saison[] = []
  episodes: Episode[][] = []

  constructor(private service: ApiService<Series>,
    private saisonService: ApiSaisonService,
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
          mergeMap((d: Saison[]) => {
            this.saisons = d
            return this.episodeService.getBySaisonIdIn(d.map(e => e.seriesId.toString()))
          })
        ).subscribe((d: Episode[]) => {
          for (let index = 0; index < this.saisons.length; index++) {
            let temp: Episode[] = []
            d.forEach((e: Episode) => {
              if (!temp.includes(e) && e.saisonId == this.saisons[index].id)
                temp.push(e)
            })
            this.episodes.push(temp)            
          }
        })
      }
    })
  }
}
