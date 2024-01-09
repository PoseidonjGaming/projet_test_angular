import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TableCRUDComponent } from '../generic/table-crud/table-crud.component';
import { Base } from '../../../models/base.model';
import { MatTabsModule } from '@angular/material/tabs';
import { FormComponent } from '../generic/form/form.component';
import { AdminService } from '../../../service/admin/admin.service';
import { FormGroup, Validators } from '@angular/forms';
import { Review } from '../../../models/review.model';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    MenuComponent,
    TableCRUDComponent,
    FormComponent,
    ScrollingModule,
    MatTabsModule
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  type = 'review'
  columns = [
    { name: 'note', header: 'Note' },
    { name: 'action', header: 'Action' }
  ]

  controls: { name: string, type: string }[] = []
  validators = [
    { controlName: 'userId', validators: [Validators.required, Validators.min(1)] },
    { controlName: 'seriesId', validators: [Validators.required, Validators.min(1)] },
    { controlName: 'note', validators: [Validators.required, Validators.min(0), Validators.max(5)] }
  ]
  formReview?: FormGroup
  displayMap = new Map<string, string>()
  typeMap = new Map<string, string>()

  displays: { control: string, value: string }[] = [
    { control: 'userId', value: 'username' },
    { control: 'seriesId', value: 'name' },
  ]

  types: { control: string, value: string }[] = [
    { control: 'userId', value: 'user' },
    { control: 'seriesId', value: 'series' },
  ]
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.formReview = this.adminService.init(new Review(), this.controls)
    this.displayMap = this.adminService.initMap(this.displays)
    this.typeMap = this.adminService.initMap(this.types)
  }

  populate(base: Base) {

  }

  submit(event: { dto: Base, isSubmit: boolean }){
    this.adminService.submit(this.type, event)
  }
}
