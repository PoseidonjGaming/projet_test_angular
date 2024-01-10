import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { FormComponent } from '../generic/form/form.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';
import { Movie } from '../../../models/movie.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Base } from '../../../models/base.model';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../service/admin/toAdd/to-add.service';
import { ApiService } from '../../../service/api/api.service';
import { UtilsService } from '../../../service/utils/utils.service';
import { AdminService } from '../../../service/admin/admin.service';
import { FileService } from '../../../service/api/file/file.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    MenuComponent,
    TableCRUDComponent,
    ToAddTableComponent,
    FormComponent,
    ScrollingModule,
    MatTabsModule
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit {
  type = 'movie'

  columns: { name: string, header: string, display: string[] }[] = [
    { name: 'name', header: 'Nom', display: [] },
    { name: 'releaseDate', header: 'Date de diffusion', display: [] },
    { name: 'action', header: 'Action', display: [] }
  ]

  controls: { name: string, type: string }[] = []
  formMovie?: FormGroup

  displays: { control: string, value: string }[] = [
    { control: 'nextMovieId', value: 'name' },
    { control: 'nextSeriesId', value: 'name' },
    { control: 'previousMovieId', value: 'name' },
    { control: 'previousSeriesId', value: 'name' }
  ]

  types: { control: string, value: string }[] = [
    { control: 'nextMovieId', value: 'movie' },
    { control: 'nextSeriesId', value: 'series' },
    { control: 'previousMovieId', value: 'movie' },
    { control: 'previousSeriesId', value: 'series' },
    { control: 'categoryIds', value: 'category' }
  ]

  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private fileService: FileService,
    private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService,
    private utilsService: UtilsService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.formMovie = this.adminService.init(new Movie(), this.controls)

    this.displayMap = this.adminService.initMap(this.displays)
    this.typeMap = this.adminService.initMap(this.types)


  }

  populate(series: Base) {
    if (this.formMovie) {
      this.utilsService.populate(series, this.formMovie)
    }
  }

  submit(event: { dto: Base, isSubmit: boolean }) {
    if (this.formMovie) {
      const file = this.formMovie.value['posterFile']
      this.fileService.upload(file, 'movie').subscribe(() => { })
      this.adminService.submit(this.type, event)
    }
  }

  saves(bases: Base[]) {
    this.service.saves(this.type, bases).subscribe(() => {
      this.crudService.next(new Movie())
      this.toAddService.next(new Movie())
    })
  }
}
