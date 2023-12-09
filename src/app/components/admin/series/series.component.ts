import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { combineLatest, mergeMap } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
import { UtilsService } from 'src/app/service/utils/utils.service';
import { AfficheDialogComponent } from '../affiche-dialog/affiche-dialog.component';
import { ListComponent } from '../list/list.component';
import { Base } from 'src/app/models/base.model';
import { MatTabGroup } from '@angular/material/tabs';
import { MatchMode } from 'src/app/models/MatchMode.model';
import { StringMatcher } from 'src/app/models/StringMatcher.model';
import { Season } from 'src/app/models/season.model';
import { MapType } from '@angular/compiler';
import { Sort } from '@angular/material/sort';
import { PageResponse } from 'src/app/models/PageResponse.model';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {

  //#region properties
  series: Series[] = []
  toAddSeries: Series[] = []
  categories: Category[] = []
  seasons: Season[] = []
  files: File[] = []
  columns = ['name', 'releaseDate', 'action']
  seasonColumns = ['number', 'action']
  notification: number = 0
  toAddIndex = -1

  @ViewChild('tableToAdd') tableToAdd: MatTable<Series> | undefined
  @ViewChild(ListComponent) listComponent: ListComponent | undefined

  formSeries = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(null, [Validators.required]),
    releaseDate: new FormControl(new Date()),
    summary: new FormControl(null),
    poster: new FormControl(''),
    trailerUrl: new FormControl(null),
    categories: new FormControl(this.categories),
    seasonsIds: new FormControl(),
    seasons: new FormControl(0, [Validators.min(0)])
  })
  //#endregion


  constructor(private service: ApiService,
    private seriesService: ApiSeriesService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    combineLatest([
      this.service.getAll<PageResponse<Series>>(0, 0, 'series'),
      this.service.getAll<PageResponse<Category>>(0, 0, 'category'),
    ]).subscribe(([seriesDtos, categoryDtos]) => {
      this.series = seriesDtos.content
      this.categories = categoryDtos.content
    })
  }

  //#region toAddSeries
  add() {
    if (this.formSeries.valid) {
      if (this.toAddIndex != -1) {
        this.toAddSeries[this.toAddIndex] = this.setValue(new Series())
        this.toAddIndex = 0
      } else {
        this.toAddSeries.push(this.setValue(new Series()))
      }

      this.listComponent?.update(this.toAddSeries)
      this.notification++
    }

  }

  update(series: Base[]) {
    this.series = series as Series[]
  }
  //#endregion

  //#region poster
  setPoster(event: any) {
    let file = event.target.files[0] as File
    console.log(file.name);

    if (!this.files.find((f: File) => file.name === f.name)) {
      this.files.push(file)
      this.formSeries.controls.poster.setValue(file.name as string)
    }
  }

  openPosterDialog() {
    const file = this.files.find((value: File) => value.name === this.formSeries.controls.poster.value)
    if (file)
      this.dialog.open(AfficheDialogComponent, {
        data: file,
        height: '95%'
      });
    else
      this.snack.open("Aucune affiche n'a été sélectionnée", "Fermer", { duration: 5 * 1000 })
  }
  //#endregion

  //#region tableSeries
  populate(series: Base, tab: MatTabGroup) {
    this.utilService.populate(series, this.formSeries)


    combineLatest([
      this.service.getAll<PageResponse<Category>>(0, 0, 'category'),
      this.service.getByIds(series['seasonIds'], 'season')
    ]).subscribe(([categoryDtos, seasonDtos]) => {
      this.formSeries.controls.categories.setValue(categoryDtos.content.filter((category: Category) => series['categoryIds'].includes(category.id)))
      this.categories = categoryDtos.content.filter((category: Category) => !series['categoryIds'].includes(category.id))
      this.formSeries.controls.seasons.setValue(seasonDtos.length)
    })

    if (series['id'] == 0) {
      this.toAddIndex = this.toAddSeries.indexOf(series as Series)
    }
    tab.selectedIndex = 1

  }

  deletes(series: Series) {
    this.service.delete('series', series.id.toString()).pipe(
      mergeMap(() => this.service.getAll<PageResponse<Series>>(0, 0, 'series'))
    ).subscribe((dtos: PageResponse<Series>) => {
      this.series = dtos.content
    })
  }


  //#endregion

  //#region Categories
  drop(event: CdkDragDrop<Category[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );


    }
  }

  search(term: string) {
    if (term)
      this.service.search<Category>('category',
        MatchMode.ANY, StringMatcher.CONTAINING,
        new Date(), new Date(), { name: term }).subscribe((dtos: Category[]) => this.categories = dtos)


  }
  //#endregion

  //#region other
  submit() {
    if (this.formSeries.valid) {
      let series = this.setValue(new Series())
      series.categoryIds = this.formSeries.controls.categories.value?.map((s) => s.id) as number[]

      this.seriesService.saveWithSeasons(series, this.formSeries.controls.seasons.value!).pipe(
        mergeMap((dto: Series) => this.service.getAll<PageResponse<Series>>(0, 0, 'series'))
      ).subscribe((dtos: PageResponse<Series>) => {
        this.utilService.reset()
        this.series = dtos.content
        const type = (this.formSeries.controls.id.value! > 0) ? 'modifié' : 'ajouté'
        this.snack.open(`Série ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
      })
    }



  }

  setValue(series: Series) {
    Object.keys(series).forEach((e) => {
      const control = this.formSeries.get(e)
      if (control && e !== 'releaseDate')
        series[e] = control.value
      else if (control && e === 'releaseDate')
        series[e] = new Date(control?.value)
    })
    series.releaseDate.setHours(1)
    return series
  }

  updateNotif(event: number) {
    if (event == 0)
      this.notification = 0

  }
  //#endregion

}
