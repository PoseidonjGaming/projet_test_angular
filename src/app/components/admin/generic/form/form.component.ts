import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Base } from 'src/app/models/base.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  @Input() form?: FormGroup
  @Input() labels: string[] = []
  @Input() controls: { name: string, type: string }[] = []
  @Input() searchMap = new Map<string, string>()
  @Input() typeMap = new Map<string, string>()
  @Input() type = ''
  @Output() listEmmitter = new EventEmitter<string>()

  constructor(private service: ApiService) { }


  submit() {
    this.form?.markAllAsTouched()
    if (this.form?.valid)
      this.service.save(this.type, this.form.value).subscribe(() => this.listEmmitter.emit('test'))
  }

}
