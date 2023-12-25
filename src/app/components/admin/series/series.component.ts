import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { Base } from '../../../models/base.model';
import { Series } from '../../../models/series.model';
import { UtilsService } from '../../../service/utils/utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [MenuComponent,
    TableCRUDComponent,
    FormComponent,
    ScrollingModule,
    MatTabsModule
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.css'
})
export class SeriesComponent implements OnInit {
  columns = [
    { name: 'name', header: 'Nom' }
  ]

  controls: { name: string, type: string }[] = []

  formSeries?: FormGroup

  typeMap = new Map<string, string>()
  displayMap = new Map<string, string>()

  dataSource = new Subject<Base[]>()

  constructor(private formBuilder: FormBuilder, private utilService: UtilsService) { }
  ngOnInit(): void {
    const dto = new Series()
    this.formSeries = this.formBuilder.group(dto)

    Object.keys(dto).forEach(property => {
      this.controls.push({ name: property, type: typeof (dto[property]) })
    })

    this.typeMap.set('nextMovieId', 'movie')
    this.typeMap.set('nextSeriesId', 'series')
    this.typeMap.set('previousMovieId', 'movie')
    this.typeMap.set('previousSeriesId', 'series')

    this.displayMap.set('nextMovieId', 'name')
    this.displayMap.set('nextSeriesId', 'name')
    this.displayMap.set('previousMovieId', 'name')
    this.displayMap.set('previousSeriesId', 'name')
  }

  populate(dto: Base) {
    if (this.formSeries)
      this.utilService.populate(dto, this.formSeries)
  }
}
