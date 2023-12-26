import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Subject, endWith } from 'rxjs';
import { Base } from '../../../models/base.model';
import { Series } from '../../../models/series.model';
import { UtilsService } from '../../../service/utils/utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { DragAndDropComponent } from '../generic/drag-and-drop/drag-and-drop.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [MenuComponent,
    TableCRUDComponent,
    FormComponent,
    DragAndDropComponent,
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

  constructor(private formBuilder: FormBuilder, private service: ApiService, private utilService: UtilsService) { }
  ngOnInit(): void {
    const dto = new Series()
    this.formSeries = this.formBuilder.group(dto)
    Object.keys(dto).forEach(property => {
      this.controls.push({ name: property, type: typeof (dto[property]) })
    })

    this.formSeries.controls['name'].addValidators([Validators.required])

    this.typeMap.set('nextMovieId', 'movie')
    this.typeMap.set('nextSeriesId', 'series')
    this.typeMap.set('previousMovieId', 'movie')
    this.typeMap.set('previousSeriesId', 'series')
    this.typeMap.set('categoryIds', 'category')

    this.displayMap.set('nextMovieId', 'name')
    this.displayMap.set('nextSeriesId', 'name')
    this.displayMap.set('previousMovieId', 'name')
    this.displayMap.set('previousSeriesId', 'name')

  }

  populate(dto: Base) {
    if (this.formSeries) {
      this.utilService.populate(dto, this.formSeries)
      Object.keys(this.formSeries.controls).filter(control => control.endsWith('Ids')).forEach(controlName => {
        const dragControl = this.formSeries?.get(controlName.slice(0, controlName.length - 3))
        const controlIds = this.formSeries?.get(controlName)
        const type = this.typeMap.get(controlName)
        if (controlIds && dragControl && type) {
          this.service.getByIds(type, controlIds.value).subscribe((dtos: Base[]) => {
            dragControl.setValue(dtos)
          })
        }


      })
    }

  }
}
