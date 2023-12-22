import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base } from 'src/app/models/base.model';
import { Series } from 'src/app/models/series.model';
import { UtilsService } from 'src/app/service/utils/utils.service';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrl: './series.component.css'
})
export class SeriesComponent implements OnInit {

  formSeries?: FormGroup
  controls: { name: string, type: string }[] = []
  labels = ['Id', 'Nom',
    'Date de diffusion', 'Résumé',
    'Affiche', 'Lien du trailer',
    '', '', '',
    'Prochain film', 'Film précédent',
    'Prochaine série', 'Série précédente']

  searchMap = new Map<string, string>()
  typeMap = new Map<string, string>()


  constructor(private formBuilder: FormBuilder, private utilService: UtilsService) { }

  ngOnInit(): void {
    const dto = new Series()
    this.formSeries = this.formBuilder.group(dto)

    this.formSeries.controls['name'].addValidators(Validators.required)
    Object.keys(dto).forEach(e => {
      if (e.endsWith('Id'))
        this.formSeries?.get(e)?.addValidators(Validators.min(1))
      this.controls.push({ name: e, type: typeof (dto[e]) })
    })

    this.searchMap.set('nextSeriesId', 'name')
    this.searchMap.set('nextMovieId', 'name')
    this.searchMap.set('previousMovieId', 'name')
    this.searchMap.set('previousSeriesId', 'name')
    this.typeMap.set('nextSeriesId', 'series')
    this.typeMap.set('nextMovieId', 'movie')
    this.typeMap.set('previousMovieId', 'movie')
    this.typeMap.set('previousSeriesId', 'series')
  }

  populate(series: Base) {
    this.utilService.populate(series, this.formSeries!)
  }

  test(string: string) {
    
  }
}
