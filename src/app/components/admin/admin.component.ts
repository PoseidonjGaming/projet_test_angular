import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, mergeMap, startWith } from 'rxjs';
import { Base } from '../../models/base.model';
import { AdminService } from '../../service/admin/admin.service';
import { ApiService } from '../../service/api/api.service';
import { MenuComponent } from '../menu/menu.component';
import { DragAndDropComponent } from './generic/drag-and-drop/drag-and-drop.component';
import { FormComponent } from './generic/form/form.component';
import { TableCRUDComponent } from './generic/table-crud/table-crud.component';
import { ToAddTableComponent } from './generic/to-add-table/to-add-table.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MenuComponent,
    MatSidenavModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTableModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormComponent,
    ToAddTableComponent,
    TableCRUDComponent,
    DragAndDropComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {



  controls: { name: string, type: string }[] = []
  typeMap = new Base()
  displayMap = new Base()
  type = ''

  form?: FormGroup
  formColumns = new FormGroup({})

  resetDto = new Base()

  columns: { name: string, type: string }[] = []

  constructor(private service: ApiService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.route.params.pipe(
      mergeMap(params => {
        this.type = params['type']
        return combineLatest([
          this.service.structure(this.type),
          this.service.types(this.type),
          this.service.display(this.type)
        ])
      })
    ).subscribe(([str, type, display]) => {
      this.controls = Object.entries(str).map(v => { return { name: v[0], type: v[1] } })

      this.controls.forEach(c => {
        this.formColumns.addControl(c.name, this.formBuilder.control(this.controls.indexOf(c) < 3))
      })

      this.formColumns.valueChanges.pipe(startWith(this.formColumns.value)).subscribe((value: any) => {
        this.columns = this.controls.filter(c => value[c.name])
        this.columns.push({ name: 'action', type: 'action' })
      })

      this.typeMap = type
      this.displayMap = display

      Object.entries(str).forEach(s => {
        let value: any = ''
        if (s[0].endsWith('Id') || s[0] === 'id') {
          value = null
        }

        if (s[0].endsWith('Ids')) {
          value = []
        }

        if (s[1] === 'date') {
          value = new Date()
        }

        this.resetDto[s[0]] = value
      })


      this.form = this.formBuilder.group(this.resetDto)

      this.adminService.next({ dto: this.resetDto, isPost: true })
    })
  }

  populate(base: Base) {
    Object.entries(base).forEach(v => {
      if (v[0].endsWith('Id') && !v[1]) {
        this.form?.controls[v[0]].setValue('')
      } else {
        this.form?.controls[v[0]].setValue(v[1])
      }

    })
    const idsProperty = Object.entries(base).filter(v => v[0].endsWith('Ids'))
    const idsObs = idsProperty.map(v => this.service.getByIds(this.typeMap[v[0]], v[1]))

    combineLatest(idsObs).subscribe(value => {
      idsProperty.forEach(v => {
        this.form?.controls[v[0].slice(0, -3)].setValue(value[idsProperty.indexOf(v)])
      })

    })
  }

  getIdsControls() {
    return this.controls.filter(c => c.name.endsWith('Ids'))
  }

  save(event: { dto: Base; isSubmit: boolean; }) {
    if (event.isSubmit) {
      this.service.save(this.type, event.dto).subscribe(value => {
        this.adminService.next({ dto: value, isPost: true })
      })
    } else {
      this.adminService.next({ dto: event.dto, isPost: false })
    }
  }

  saves(event: Base[]) {
    console.log(event);

    this.service.saves(this.type, event).subscribe(() => {
      this.adminService.next({ dto: { id: '' }, isPost: true })
    })
  }
}
