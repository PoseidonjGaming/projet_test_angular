import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, mergeMap } from 'rxjs';
import { Base } from '../../models/base.model';
import { ApiService } from '../../service/api/api.service';
import { MenuComponent } from '../menu/menu.component';
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
    ScrollingModule,
    ReactiveFormsModule,
    FormComponent,
    ToAddTableComponent,
    TableCRUDComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  isOpened = false
  controls: { name: string, type: string }[] = []
  type = ''
  form?: FormGroup
  typeMap = new Map<string, string>()
  displayMap = new Map<string, string>()

  columns: { name: string, type: string }[] = []
  formColums: FormGroup = new FormGroup({})

  constructor(private service: ApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {

    this.route.paramMap.pipe(
      mergeMap(paramMap => {
        this.type = paramMap.get('type')!
        return combineLatest([
          this.service.structure(this.type),
          this.service.types(this.type),
          this.service.display(this.type)
        ])
      })
    ).subscribe(([str, types, display]) => {
      this.typeMap = new Map<string, string>(Object.entries(types))
      this.displayMap = new Map<string, string>(Object.entries(display))

      Object.keys(str).forEach(s => {
        this.controls.push({ name: s, type: str[s] })
      })

      this.form = this.formBuilder.group(str)

      Object.keys(str).filter(s => s.endsWith('Id')).forEach(s => {
        this.form?.addControl(s.replace('Id', ''), new FormControl<Base>({}))
      })

      this.form.reset()




      this.controls.forEach(c => {
        this.formColums.addControl(c.name,
          (this.controls.indexOf(c) < 3) ? this.formBuilder.control(true) : this.formBuilder.control(false))
      })

      this.filterColumn(this.formColums.value)
      this.formColums.valueChanges.subscribe((value) => {
        this.filterColumn(value) 
      })
    })



  }
  private filterColumn(value: any) {
    let displayedColumn = Object.entries(value).filter(v => v[1]).map(v => v[0])    
    this.columns = this.controls.filter(c => displayedColumn.includes(c.name))
    this.columns.push({ name: 'action', type: 'action' })
    if (this.columns.length > 3) {
      Object.entries(value).filter(v => !v[1]).forEach(v => {
        this.formColums.controls[v[0]].disable()
      })
    } else {
      this.formColums.enable()
    }
  }
}
