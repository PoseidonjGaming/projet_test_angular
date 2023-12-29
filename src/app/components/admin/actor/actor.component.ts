import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Actor } from '../../../models/actor.model';
import { Base } from '../../../models/base.model';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../service/admin/toAdd/to-add.service';
import { ApiService } from '../../../service/api/api.service';
import { UtilsService } from '../../../service/utils/utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { FormComponent } from '../generic/form/form.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-actor',
  standalone: true,
  imports: [MenuComponent,
    TableCRUDComponent,
    FormComponent,
    ToAddTableComponent,
    MatTabsModule,
    MatButtonModule,
    ScrollingModule],
  templateUrl: './actor.component.html',
  styleUrl: './actor.component.css'
})
export class ActorComponent implements OnInit {
  type = 'actor'

  columns: { name: string, header: string }[] = [
    { name: 'firstname', header: 'Prénom' },
    { name: 'lastname', header: 'Nom de famille' },
    { name: 'action', header: 'Action' }
  ]

  controls: { name: string, type: string }[] = []
  formActor?: FormGroup

  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private utilsService: UtilsService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.formActor = this.adminService.init(new Actor(), this.controls)
  }

  populate(series: Base) {
    if (this.formActor) {
      this.utilsService.populate(series, this.formActor)
    }
  }

  submit(event: { dto: Base, isSubmit: boolean }) {
    this.adminService.submit(this.type, event)
  }

  saves(bases: Base[]) {
    this.adminService.saves(this.type, new Actor(), bases)
  }
}
