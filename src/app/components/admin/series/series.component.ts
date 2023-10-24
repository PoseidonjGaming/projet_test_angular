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
import { AfficheDialogComponent } from './affiche-dialog/affiche-dialog.component';

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
  files: File[] = []
  columns = ['name', 'releaseDate', 'action']
  notification: number = 0
  toAddIndex = -1

  @ViewChild('tableToAdd') tableToAdd: MatTable<Series> | undefined

  formSeries = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(null, [Validators.required]),
    releaseDate: new FormControl(new Date()),
    summary: new FormControl(null),
    poster: new FormControl(''),
    trailerUrl: new FormControl(null),
    categories: new FormControl(this.categories),
    seasonsIds: new FormControl()
  })
  //#endregion


  constructor(private service: ApiSeriesService,
    private categoryService: ApiService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    combineLatest([
      this.service.getAll<Series>(),
      this.categoryService.getAll<Category>('category'),
    ]).subscribe(([seriesDtos, categoryDtos]) => {
      this.series = seriesDtos
      this.categories = categoryDtos
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

      this.utilService.reset()
      this.utilService.updateTable(this.tableToAdd!)
      this.notification++
    }

  }

  remove(index: number) {
    this.toAddSeries.splice(index, 1)
    this.utilService.updateTable(this.tableToAdd!)
  }

  saves() {
    this.service.saveFiles(this.files).pipe(
      mergeMap(() => this.service.saves<Series>('series', this.toAddSeries)),
      mergeMap(() => this.service.getAll<Series>('series'))
    ).subscribe((dtos: Series[]) => {
      this.toAddSeries = []
      this.series = dtos
      this.snack.open(`Séries modifié et/ou ajoutés avec succès`, 'Fermer', { duration: 5 * 1000 })
    })

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
    console.log(this.files);


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
  populate(series: Series) {
    this.utilService.populate(series, this.formSeries)
    this.categoryService.getAll<Category>('category').subscribe((dtos: Category[]) => {
      this.formSeries.controls.categories.setValue(dtos.filter((category: Category) => series.categoryIds.includes(category.id)))
      this.categories = dtos.filter((category: Category) => !series.categoryIds.includes(category.id))
    })
    console.log(this.categories, this.formSeries.controls.categories.value);

    if (series.id == 0) {
      this.toAddIndex = this.toAddSeries.indexOf(series)
    }
  }

  deletes(series: Series) {
    this.service.delete('series', series.id.toString()).pipe(
      mergeMap(() => this.service.getAll<Series>('series'))
    ).subscribe((dtos: Series[]) => {
      this.series = dtos
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
      this.categoryService.search<Category>('category', term).subscribe((dtos: Category[]) => this.categories = dtos)


  }
  //#endregion

  //#region other
  submit() {
    if (this.formSeries.valid) {
      let series = this.setValue(new Series())
      series.categoryIds = this.formSeries.controls.categories.value?.map((s) => s.id) as number[]
      console.log(series);
      if (this.files.length > 0) {
        this.service.saveWithFile(series, this.files[0]).pipe(
          mergeMap(() => this.service.getAll<Series>())
        ).subscribe((dtos: Series[]) => {
          this.utilService.reset()
          this.series = dtos
          const type = (this.formSeries.controls.id.value! > 0) ? 'modifié' : 'ajouté'
          this.snack.open(`Série ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
        })
      } else {
        this.service.save<Series>('series', series).pipe(
          mergeMap(() => this.service.getAll<Series>())
        ).subscribe((dtos: Series[]) => {
          this.utilService.reset()
          this.series = dtos
          const type = (this.formSeries.controls.id.value! > 0) ? 'modifié' : 'ajouté'
          this.snack.open(`Série ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
        })
      }
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
