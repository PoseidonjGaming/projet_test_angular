import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Base } from '../../../../../models/base.model';
import { ApiService } from '../../../../../service/api/api.service';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit {

  @Input({ required: true }) form?: FormGroup
  @Input({ required: true }) control: { name: string, type: string } = {
    name: '',
    type: ''
  }
  @Input({ required: true }) type = ''
  @Input({ required: true }) propertyToDisplay = ''

  selectList: Base[] = []


  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.service.getAll(this.type).subscribe((dtos: Base[]) => {
      this.selectList = dtos
    })
  }

  getControlName() {
    return this.control.name.slice(0, this.control.name.length - 2)
  }

}
