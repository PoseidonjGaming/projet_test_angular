import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  series: Series[] = []
  toAddSeries: Series[] = []
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

  constructor(private service: ApiService<Series>, @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.sub = this.service.getAll('series').subscribe((d: Series[]) => this.series = d)
  }

  submit() {
    console.log("test");

  }

  populate(series: Series) {
    this.formSeries.setValue(series)
  }

  add() {
    this.toAddSeries.push(this.formSeries.value as Series)
  }

  remove(index: number) {
    this.toAddSeries.splice(index, 1)
  }

  saves() {
    this.service.saves('series', this.toAddSeries).subscribe(()=>this.ngOnInit())
  }
}
