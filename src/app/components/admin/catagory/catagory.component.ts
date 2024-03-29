import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { FormComponent } from '../generic/form/form.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { ToAddTableComponent } from '../generic/to-add-table/to-add-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Category } from '../../../models/category.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Base } from '../../../models/base.model';
import { CrudService } from '../../../service/admin/crud/crud.service';
import { ToAddService } from '../../../service/admin/toAdd/to-add.service';
import { ApiService } from '../../../service/api/api.service';
import { UtilsService } from '../../../service/utils/utils.service';
import { AdminService } from '../../../service/admin/admin.service';

@Component({
  selector: 'app-catagory',
  standalone: true,
  imports: [
    MenuComponent,
    FormComponent,
    TableCRUDComponent,
    ToAddTableComponent,
    ScrollingModule,
    MatTabsModule
  ],
  templateUrl: './catagory.component.html',
  styleUrl: './catagory.component.css'
})
export class CatagoryComponent {
  type = 'category'

  columns: { name: string, header: string, display: string[] }[] = [
    { name: 'name', header: 'Nom', display: [] },
    { name: 'action', header: 'Action', display: [] }
  ]

  controls: { name: string, type: string }[] = []
  formCategory?: FormGroup
  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()



  constructor(private utilsService: UtilsService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.formCategory = this.adminService.init(new Category(), this.controls)
  }

  populate(series: Base) {
    if (this.formCategory) {
      this.utilsService.populate(series, this.formCategory)
    }
  }

  submit(event: { dto: Base, isSubmit: boolean }) {
    this.adminService.submit(this.type, event)
  }

  saves(bases: Base[]) {
    this.adminService.saves(this.type, new Category(), bases)
  }
}
