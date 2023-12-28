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
import { UtilsService } from '../../../service/api/utils/utils.service';

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

  columns: { name: string, header: string }[] = [
    { name: 'name', header: 'Nom' },
    { name: 'releaseDate', header: 'Date de diffusion' },
    { name: 'action', header: 'Action' }
  ]

  controls: { name: string, type: string }[] = []
  formMovie?: FormGroup
  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private formBuilder: FormBuilder,
    private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.formMovie = this.formBuilder.group(new Movie())
    Object.keys(this.formMovie.controls).forEach(control => {
      this.controls.push({ name: control, type: typeof (this.formMovie?.controls[control]) })
    })

    this.formMovie.addControl('nextMovie', new FormControl([]))
    this.formMovie.addControl('nextSeries', new FormControl([]))
    this.formMovie.addControl('previousMovie', new FormControl([]))
    this.formMovie.addControl('previousSeries', new FormControl([]))

    this.displayMap.set('nextMovieId', 'name')
    this.displayMap.set('nextSeriesId', 'name')
    this.displayMap.set('previousMovieId', 'name')
    this.displayMap.set('previousSeriesId', 'name')

    this.typeMap.set('nextMovieId', 'movie')
    this.typeMap.set('nextSeriesId', 'series')
    this.typeMap.set('previousMovieId', 'movie')
    this.typeMap.set('previousSeriesId', 'series')

  }

  populate(series: Base) {
    if (this.formMovie) {
      this.utilsService.populate(series, this.formMovie)
    }
  }

  submit(event: { dto: Base, type: string }) {
    if (event.type === 'submit')
      this.service.save(this.type, event.dto).subscribe((movie) => {
        this.crudService.next(movie)
      })
    else
      this.toAddService.next(event.dto)

  }

  saves(bases: Base[]) {
    this.service.saves(this.type, bases).subscribe(() => {
      this.crudService.next(new Movie())
      this.toAddService.next(new Movie())
    })
  }
}
