import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Base } from 'src/app/models/base.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit {


  @Input() control = { name: '', type: '' }
  @Input() type = ''
  @Input() propertyToDisplay = ''
  @Input() form?: FormGroup
  @Input() header = ''

  options: Base[] = []

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.service.getAll(this.type).subscribe(dtos => {
      this.options = dtos
    })
  }
}
