import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { Base } from '../../../models/base.model';
import { Series } from '../../../models/series.model';
import { MenuComponent } from '../../menu/menu.component';
import { DragAndDropComponent } from '../generic/drag-and-drop/drag-and-drop.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { UtilsService } from '../../../service/utils/utils.service';
import { ApiService } from '../../../service/api/api.service';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../service/admin/toAdd/to-add.service';
import { FormService } from '../../../service/admin/form/form.service';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [MenuComponent,
    TableCRUDComponent,
    ToAddTableComponent,
    FormComponent,
    DragAndDropComponent,
    ScrollingModule,
    MatTabsModule,
    MatButtonModule
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.css'
})
export class SeriesComponent implements OnInit {

  type = 'series'

  columns: { name: string, header: string }[] = [
    { name: 'name', header: 'Nom' },
    { name: 'releaseDate', header: 'Date de diffusion' },
    { name: 'action', header: 'Action' }
  ]

  controls: { name: string, type: string }[] = []
  formSeries?: FormGroup
  validators = [
    { controlName: 'name', validators: [Validators.required] },
    { controlName: 'nextMovieId', validators: [Validators.required, Validators.min(1)] },
    { controlName: 'nextSeriesId', validators: [Validators.required, Validators.min(1)] },
    { controlName: 'previousMovieId', validators: [Validators.required, Validators.min(1)] },
    { controlName: 'previousSeriesId', validators: [Validators.required, Validators.min(1)] },
  ]
  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private formBuilder: FormBuilder,
    private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService,
    private utilsService: UtilsService,
    private formService: FormService) { }
  ngOnInit(): void {
    this.formSeries = this.formService.createForm(new Series(), this.controls)

    this.displayMap.set('nextMovieId', 'name')
    this.displayMap.set('nextSeriesId', 'name')
    this.displayMap.set('previousMovieId', 'name')
    this.displayMap.set('previousSeriesId', 'name')

    this.typeMap.set('nextMovieId', 'movie')
    this.typeMap.set('nextSeriesId', 'series')
    this.typeMap.set('previousMovieId', 'movie')
    this.typeMap.set('previousSeriesId', 'series')

    this.typeMap.set('categoryIds', 'category')
  }

  populate(series: Base) {
    if (this.formSeries) {
      this.utilsService.populate(series, this.formSeries, this.typeMap)
     
    }
  }

  submit(event: { dto: Base, type: string }) {
    if (event.type === 'submit')
      this.service.save(this.type, event.dto).subscribe((series) => {
        this.crudService.next(series)
      })
    else
      this.toAddService.next(event.dto)

  }

  saves(bases: Base[]) {
    this.service.saves(this.type, bases).subscribe(() => {
      this.crudService.next(new Series())
      this.toAddService.next(new Series())
    })
  }


}
