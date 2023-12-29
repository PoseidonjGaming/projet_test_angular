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
    { name: 'name', header: 'Nom' },
    { name: 'releaseDate', header: 'Date de diffusion' },
    { name: 'action', header: 'Action' }
  ]
  controls: { name: string, type: string }[] = []

  type = 'episode'

  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()

  formEpisode?: FormGroup

  constructor(private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService,
    private utilsService: UtilsService,
    private formService: FormService
  ) { }

  ngOnInit(): void {

    this.formEpisode = this.formService.createForm(new Episode(), this.controls)

    this.formEpisode.controls['seriesId'].addValidators(Validators.min(1))
    this.formEpisode.controls['seasonId'].addValidators(Validators.min(1))




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



    this.displayMap.set('seriesId', 'name')
    this.displayMap.set('seasonId', 'number')

    this.typeMap.set('seriesId', 'series')
    this.typeMap.set('seasonId', 'season')
  }

  populate(series: Base) {
    if (this.formEpisode) {
      this.utilsService.populate(series, this.formEpisode)
    }
  }

  submit(event: { dto: Base, type: string }) {
    if (this.formEpisode) {
      if (event.type === 'submit') {

        this.service.save(this.type, event.dto).subscribe((series) => {
          this.crudService.next(series)
        })
      }

      else {
        this.toAddService.next(event.dto)
      }

    }


  }

  saves(bases: Base[]) {
    this.service.saves(this.type, bases).subscribe(() => {
      this.crudService.next(new Episode())
      this.toAddService.next(new Episode())
    })
  }

}
