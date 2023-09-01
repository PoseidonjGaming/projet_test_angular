import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, forkJoin } from 'rxjs';
import { Series } from 'src/app/models/series.model';
import { SeriesService } from 'src/app/service/series/series.service';
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
  columns = ['nom', 'dateDiff', 'affiche', 'action']

  formSeries = new FormGroup({
    id: new FormControl(0),
    nom: new FormControl('', [Validators.required]),
    dateDiff: new FormControl(new Date()),
    resume: new FormControl(''),
    affiche: new FormControl(''),
    urlBa: new FormControl('')
  })

  sub?: Subscription

  constructor(private service: SeriesService,
    private utilService: UtilsService,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.sub = this.service.getAll('series').subscribe((d: Series[]) => this.series = d)
  }

  submit() {
    if (this.formSeries.valid) {
      this.service.save('series', this.formSeries.value as Series).subscribe(() => {
        this.ngOnInit()
      })
    }

  }

  populate(series: Series) {
    this.utilService.populate(series, this.formSeries)
  }

  add() {
    if (this.formSeries.valid) {
      this.toAddSeries.push(this.formSeries.value as Series)
      this.formSeries.reset()
    }

  }

  remove(index: number) {
    this.toAddSeries.splice(index, 1)
  }

  saves() {
    forkJoin([
      this.service.saves('series', this.toAddSeries),
      this.service.saveFiles(this.files)
    ]).subscribe(() => {
      this.toAddSeries = []
      this.ngOnInit()
    })
  }

  deletes(series: Series) {
    this.sub?.unsubscribe()
    this.service.delete('series', series.id.toString()).subscribe(() => this.ngOnInit())
  }

  setAffiche(event: any) {
    let file = event.target.files[0] as File

    if (!this.files.find((f: File) => file.name === f.name)) {
      this.files.push(file)
      this.formSeries.controls.affiche.setValue(file.name)
    }

  }

  openAfficheDialog() {
    const file = this.files.find((value: File) => value.name === this.formSeries.controls.affiche.value)
    if (file)
      this.dialog.open(AfficheDialogComponent, {
        data: file,
        height: '95%'
      });
    else
      this.snack.open("Aucune affiche n'a été sélectionnée", "Fermer", { duration: 5 * 1000 })
  }
}
