import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, forkJoin, mergeMap } from 'rxjs';
import { Series } from 'src/app/models/series.model';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
import { UtilsService } from 'src/app/service/utils/utils.service';
import { AfficheDialogComponent } from './affiche-dialog/affiche-dialog.component';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  series: Series[] = []
  toAddSeries: Series[] = []
  files: File[] = []
  columns = ['name', 'releaseDate', 'poster', 'action']

  formSeries = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    releaseDate: new FormControl(new Date()),
    summary: new FormControl(''),
    poster: new FormControl(''),
    trailerUrl: new FormControl('')
  })

  constructor(private service: ApiSeriesService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.service.getAll('series').subscribe((d: Series[]) => this.series = d)
  }

  submit() {
    if (this.formSeries.valid) {
      this.service.save('series', this.formSeries.value as Series).pipe(
        mergeMap(() => this.service.getAll('series'))
      ).subscribe((dtos: Series[]) => {
        var resetForm = <HTMLFormElement>document.getElementById('form');
        resetForm.reset();
        this.series = dtos
      })
    }

  }

  populate(series: Series) {
    this.utilService.populate(series, this.formSeries)
  }

  add() {
    if (this.formSeries.valid) {
      this.toAddSeries.push(this.formSeries.value as Series)
      var resetForm = <HTMLFormElement>document.getElementById('form');
      resetForm.reset();
    }

  }

  remove(index: number) {
    this.toAddSeries.splice(index, 1)
  }

  saves() {
    this.service.saveFiles(this.files).pipe(
      mergeMap(() => this.service.saves('series', this.toAddSeries)),
      mergeMap(() => this.service.getAll('series'))
    ).subscribe((dtos: Series[]) => {
      this.toAddSeries = []
      this.series = dtos
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
      this.formSeries.controls.poster.setValue(file.name)
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
}
