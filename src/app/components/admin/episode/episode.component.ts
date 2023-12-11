import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Observable, combineLatest, mergeMap } from 'rxjs';
import { PageResponse } from 'src/app/models/PageResponse.model';
import { Sorter } from 'src/app/models/Sorter.model';
import { MatchMode } from 'src/app/models/enum/MatchMode.model';
import { StringMatcher } from 'src/app/models/enum/StringMatcher.model';
import { Episode } from 'src/app/models/episode.model';
import { Season } from 'src/app/models/season.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {

  //#region properties
  episodes: PageResponse<Episode> = new PageResponse<Episode>()
  toAddEpisodes: Episode[] = []
  series: Series[] = []
  seasons: Season[] = []
  notification: number = 0
  sorter?: Sort

  @ViewChild('tableToAddEpisodes') table: MatTable<Episode> | undefined

  columns = ['name', 'releaseDate', 'action']

  formEpisode = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    summary: new FormControl(''),
    releaseDate: new FormControl(new Date()),
    seasonId: new FormControl(0),
    seriesId: new FormControl(1, [Validators.required, Validators.min(1)]),
    isNewSaison: new FormControl(false)
  })

  formSearch = new FormGroup({
    series: new FormControl<string>('')
  })

  filteredSeries = new Observable<Series[]>()
  //#endregion

  constructor(private service: ApiService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) {
  }


  ngOnInit(): void {
    combineLatest([
      this.service.getAllPaged<Episode>('episode', 10, 0),
      this.service.getAllPaged<Series>('series', 10, 0)
    ]).subscribe(([episodeDtos, seriesDtos]) => {
      this.episodes = episodeDtos
      this.series = seriesDtos.content
    })

    this.formEpisode.controls.seriesId.valueChanges.pipe(
      mergeMap((id: number | null) => {
        return this.service.search<Season>('season', { seriesId: id },
          MatchMode.ALL, StringMatcher.EXACT, null, null)
      })
    ).subscribe((seasons: Season[]) => {
      this.seasons = seasons
    })

    this.filteredSeries = this.formSearch.controls.series.valueChanges.pipe(
      mergeMap((value: string | null) => {
        let dto = {};
        if (typeof (value) == "string")
          dto = { name: value }
        else
          dto = value!
        return this.service.search<Series>('series', dto,
          MatchMode.ALL, StringMatcher.EXACT, null, null)
      })
    )
  }

  //#region episode

  submit() {
    if (this.formEpisode.valid) {
      if (this.formEpisode.controls.isNewSaison.value) {
        this.service.save<Season>('season', new Season(this.formEpisode.controls.seriesId.value!, this.seasons.length + 1)).pipe(
          mergeMap((season: Season) => this.service.search<Season>('season',
            { seriesId: this.formEpisode.value.seriesId! },
            MatchMode.ALL, StringMatcher.EXACT, null, null)),
          mergeMap((dtos: Season[]) => {
              this.formEpisode.controls.seasonId.setValue(dtos.slice(-1)[0].id)
              return this.service.save<Episode>('episode', this.setValue(new Episode()))
            }),
          mergeMap(() => this.service.getAllPaged<Episode>('episode', 10, 0))
        ).subscribe((dtos: PageResponse<Episode>) => {
          this.episodes = dtos
          const type = (this.formEpisode.controls.id.value! > 0) ? 'modifié' : 'ajouté'
          this.snack.open(`Episode ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
          this.reset()
          this.seasons = []
        })
      }
      else {
        this.service.save<Episode>('episode', this.setValue(new Episode())).pipe(
          mergeMap(() => this.service.getAllPaged<Episode>('episode', 10, 0))
        ).subscribe((dtos: PageResponse<Episode>) => {
          this.episodes = dtos
          const type = (this.formEpisode.controls.id.value! > 0) ? 'modifié' : 'ajouté'
          this.snack.open(`Episode ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
          this.reset()
        })
      }


    }
  }



  //#endregion


  //#region tableEpisodes
  populate(episode: Episode) {
    this.utilService.populate(episode, this.formEpisode)
  }

  deletes(episode: Episode) {
    this.service.delete('episode', episode.id).pipe(
      mergeMap(() => this.service.getAllPaged<Episode>('episode', 10, 0))
    ).subscribe((dtos: PageResponse<Episode>) => {
      this.episodes = dtos
      this.snack.open('Episode supprimé avec succès', 'Fermer', { duration: 5 * 1000 })
    })

  }

  sort(sort: Sort) {
    this.sorter = sort
    let field = sort.active
    let dir: Sorter;
    switch (sort.direction) {
      case 'asc': {
        dir = Sorter.ASC
        break;
      }

      case 'desc': {
        dir = Sorter.DESC
        break;
      }

      default: {
        field = 'id'
        dir = Sorter.ASC
        break;
      }
    }

    this.service.sort<Episode>('episode', field, dir).subscribe((dtos: Episode[]) => {
      this.episodes.content = dtos
      this.episodes.size = dtos.length
    })
  }

  page(event: PageEvent) {
    if (this.sorter) {

    } else {
      this.service.getAllPaged<Episode>('episode', event.pageSize, event.pageIndex).subscribe((dtos: PageResponse<Episode>) => this.episodes = dtos)
    }
  }
  //#endregion

  //#region toAddEpisodes
  add() {
    this.formEpisode.markAllAsTouched()
    if (this.formEpisode.valid) {
      this.toAddEpisodes.push(this.setValue(new Episode()))
      this.reset()

      this.utilService.updateTable(this.table!)
      this.notification++
    }
  }

  saves() {
    this.service.saves<Episode>('episode', this.toAddEpisodes).pipe(
      mergeMap(() => this.service.getAllPaged<Episode>('episode', 10, 0))
    ).subscribe((dtos: PageResponse<Episode>) => {
      this.toAddEpisodes = []
      this.episodes = dtos

      this.snack.open(`Episodes modifié et/ou ajoutés avec succès`, 'Fermer', { duration: 5 * 1000 })

    })
  }

  remove(index: number) {
    this.toAddEpisodes.splice(index, 1)
    this.utilService.updateTable(this.table!)
  }

  updateNotification(event: number) {
    if (event == 0)
      this.notification = 0
  }
  //#endregion

  //#region other
  setValue(episode: Episode) {
    Object.keys(episode).forEach((e) => {
      const control = this.formEpisode.get(e)
      if (control)
        episode[e] = control.value
    })
    episode.releaseDate.setHours(1)
    return episode
  }


  private reset() {
    this.utilService.reset()

    this.formEpisode.controls.releaseDate.setValue(new Date())
    this.formEpisode.controls.seriesId.setValue(1)
  }

  displaySeries(series: Series) {
    return series.name
  }

  selectSeries(event: MatAutocompleteSelectedEvent, paginator: MatPaginator) {
    this.service.searchPaged<Episode>('episode', { seriesId: event.option.value.id },
      MatchMode.ALL, StringMatcher.EXACT,
      null, null, paginator.pageIndex, paginator.pageSize,
    ).subscribe((dtos: PageResponse<Episode>) => {
      console.log(dtos);

      this.episodes = dtos
    })

  }
  //#endregion







}
