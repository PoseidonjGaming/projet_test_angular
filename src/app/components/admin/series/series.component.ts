import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { Base } from '../../../models/base.model';
import { Series } from '../../../models/series.model';
import { AdminService } from '../../../service/admin/admin.service';
import { FileService } from '../../../service/api/file/file.service';
import { UtilsService } from '../../../service/utils/utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { DragAndDropComponent } from '../generic/drag-and-drop/drag-and-drop.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';

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

  columns: { name: string, header: string, display: string[] }[] = [
    { name: 'name', header: 'Nom', display: [] },
    { name: 'releaseDate', header: 'Date de diffusion', display: [] },
    { name: 'nextSeriesId', header: 'Prochaine série', display: ['name'] },
    { name: 'action', header: 'Action', display: [] }
  ]

  controls: { name: string, type: string }[] = []
  formSeries?: FormGroup
  validators = [
    { controlName: 'name', validators: [Validators.required] }
  ]

  displays: { control: string, value: string }[] = [
    { control: 'nextMovieId', value: 'name' },
    { control: 'nextSeriesId', value: 'name' },
    { control: 'previousMovieId', value: 'name' },
    { control: 'previousSeriesId', value: 'name' },
  ]

  types: { control: string, value: string }[] = [
    { control: 'nextMovieId', value: 'movie' },
    { control: 'nextSeriesId', value: 'series' },
    { control: 'previousMovieId', value: 'movie' },
    { control: 'previousSeriesId', value: 'series' },
    { control: 'categoryIds', value: 'category' },
    { control: 'characterIds', value: 'character' }
  ]


  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private utilsService: UtilsService,
    private fileService: FileService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.formSeries = this.adminService.init(new Series(), this.controls)

    this.displayMap = this.adminService.initMap(this.displays)
    this.typeMap = this.adminService.initMap(this.types)
  }

  populate(series: Base) {
    if (this.formSeries) {
      this.utilsService.populate(series, this.formSeries, this.typeMap)

    }
  }

  submit(event: { dto: Base, isSubmit: boolean }) {
    if (this.formSeries) {
      const file = this.formSeries.value['posterFile']
      if (file)
        this.fileService.upload(file, 'series').subscribe(() => { })
      this.adminService.submit(this.type, event)
    }
  }

  saves(bases: Base[]) {
    this.adminService.saves<Series>(this.type, new Series(), bases)
  }


}
