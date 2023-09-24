import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, mergeMap } from 'rxjs';
import { Series } from 'src/app/models/series.model';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
import { UtilsService } from 'src/app/service/utils/utils.service';
import { AfficheDialogComponent } from './affiche-dialog/affiche-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/models/category.model';
import { ApiService } from 'src/app/service/api.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  series: Series[] = []
  toAddSeries: Series[] = []
  categories: Category[] = []
  files: File[] = []
  columns = ['name', 'releaseDate', 'action']
  notification: number = 0

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

  @ViewChild('tableToAdd') tableToAdd: MatTable<Series> | undefined


  constructor(private service: ApiSeriesService,
    private categoryService: ApiService<Category>,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    combineLatest([
      this.service.getAll(),
      this.categoryService.getAll('category'),
    ]).subscribe(([seriesDtos, categoryDtos]) => {
      this.series = seriesDtos
      this.categories = categoryDtos
    })
  }

  submit() {
    if (this.formSeries.valid) {
      let series = this.setValue(new Series())
      series.categoryIds = this.formSeries.controls.categories.value?.map((s) => s.id) as number[]
      this.service.save('series', this.setValue(new Series())).pipe(
        mergeMap(() => this.service.getAll('series'))
      ).subscribe((dtos: Series[]) => {
        var resetForm = <HTMLFormElement>document.getElementById('form');
        resetForm.reset();
        this.series = dtos
        const type = (this.formSeries.controls.id.value! > 0) ? 'modifié' : 'ajouté'
        this.snack.open(`Série ${type} avec succès`, 'Fermer', { duration: 5 * 1000 })
      })
    }



  }

  populate(series: Series) {
    this.utilService.populate(series, this.formSeries)
    this.formSeries.controls.categories.setValue(this.categories.filter((category: Category) => series.categoryIds.includes(category.id)))
    this.categories = this.categories.filter((category: Category) => !series.categoryIds.includes(category.id))

  }

  add() {
    if (this.formSeries.valid) {
      this.toAddSeries.push(this.setValue(new Series()))
      var resetForm = <HTMLFormElement>document.getElementById('form');
      resetForm.reset();

      this.updateTable(this.tableToAdd!, this.toAddSeries)

      this.notification++
    }

  }

  remove(index: number) {
    this.toAddSeries.splice(index, 1)
    this.updateTable(this.tableToAdd!, this.toAddSeries)
  }

  saves() {
    this.service.saveFiles(this.files).pipe(
      mergeMap(() => this.service.saves('series', this.toAddSeries)),
      mergeMap(() => this.service.getAll('series'))
    ).subscribe((dtos: Series[]) => {
      this.toAddSeries = []
      this.series = dtos
      this.snack.open(`Séries modifié et/ou ajoutés avec succès`, 'Fermer', { duration: 5 * 1000 })
    })

  }

  deletes(series: Series) {
    this.service.delete('series', series.id.toString()).pipe(
      mergeMap(() => this.service.getAll('series'))
    ).subscribe((dtos: Series[]) => {
      this.series = dtos
    })
  }

  setAffiche(event: any) {
    let file = event.target.files[0] as File

    if (!this.files.find((f: File) => file.name === f.name)) {
      this.files.push(file)
      this.formSeries.controls.poster.setValue(file.name as string)
    }

  }

  openAfficheDialog() {
    const file = this.files.find((value: File) => value.name === this.formSeries.controls.poster.value)
    if (file)
      this.dialog.open(AfficheDialogComponent, {
        data: file,
        height: '95%'
      });
    else
      this.snack.open("Aucune affiche n'a été sélectionnée", "Fermer", { duration: 5 * 1000 })
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
      this.categoryService.search('category', term).subscribe((dtos: Category[]) => this.categories = dtos)


  }

  updateTable(table: MatTable<Series>, list: Series[]) {
    table.dataSource = list
    table.renderRows()
  }

  updateNotif(event: number) {
    if (event == 0)
      this.notification = 0

  }
}
