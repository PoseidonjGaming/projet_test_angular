import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Base } from '../../../models/base.model';
import { Episode } from '../../../models/episode.model';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../service/admin/toAdd/to-add.service';
import { ApiService } from '../../../service/api/api.service';
import { UtilsService } from '../../../service/utils/utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { mergeMap, startWith } from 'rxjs';
import { MatchMode } from '../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../models/enum/StringMatcher.model';
import { Season } from '../../../models/season.model';
import { FormService } from '../../../service/admin/form/form.service';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-episode',
  standalone: true,
  imports: [MenuComponent,
    TableCRUDComponent,
    ToAddTableComponent,
    FormComponent,
    ScrollingModule,
    MatTabsModule],
  templateUrl: './episode.component.html',
  styleUrl: './episode.component.css'
})
export class EpisodeComponent implements OnInit {

  columns = [
    { name: 'name', header: 'Nom', display: [] },
    { name: 'releaseDate', header: 'Date de diffusion', display: [] },
    { name: 'action', header: 'Action', display: [] }
  ]

  controls: { name: string, type: string }[] = []

  type = 'episode'

  displays: { control: string, value: string }[] = [
    { control: 'seriesId', value: 'name' },
    { control: 'seasonId', value: 'number' }
  ]

  types: { control: string, value: string }[] = [
    { control: 'seriesId', value: 'series' },
    { control: 'seasonId', value: 'season' },
  ]
  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()

  formEpisode?: FormGroup

  constructor(private service: ApiService,
    private utilsService: UtilsService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {

    this.formEpisode = this.adminService.init(new Episode(), this.controls)

    this.formEpisode.controls['seriesId'].valueChanges.pipe(
      startWith(0),
      mergeMap((value: number) => {
        return this.service.search<Season>('season', { seriesId: value },
          MatchMode.ALL, StringMatcher.CONTAINING, null, null)
      })
    ).subscribe((values: Base[]) => {
      const seasonControl = this.formEpisode?.get('season')
      if (seasonControl) {
        seasonControl.setValue(values)
      }
    })

    this.displayMap = this.adminService.initMap(this.displays)
    this.typeMap = this.adminService.initMap(this.types)
  }

  populate(series: Base) {
    if (this.formEpisode) {
      this.utilsService.populate(series, this.formEpisode)
    }
  }

  submit(event: { dto: Base, isSubmit: boolean }) {
    this.adminService.submit(this.type, event)
  }

  saves(bases: Base[]) {
    this.adminService.saves(this.type, new Episode(), bases)
  }

}
