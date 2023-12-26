import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../../../service/api.service';
import { SelectComponent } from './select/select.component';
import { Subject, mergeMap } from 'rxjs';
import { Base } from '../../../../models/base.model';
import { UtilsService } from '../../../../service/utils/utils.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    SelectComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  @Input({ required: true }) form?: FormGroup
  @Input({ required: true }) controls: { name: string, type: string }[] = []
  @Input({ required: true }) typeMap = new Map<string, string>()
  @Input({ required: true }) displayMap = new Map<string, string>()
  @Input({ required: true }) type = ''
  @Input() dataSource = new Subject<Base[]>()

  private dto: Base = new Base()

  constructor(private service: ApiService, private utilsService: UtilsService) { }
  ngOnInit(): void {
    if (this.form)
      this.dto = this.form.value
  }

  setPoster(event: Event) {

  }

  submit(ngForm: FormGroupDirective) {
    if (this.form?.valid) {

      Object.keys(this.form.controls).filter(control => control.endsWith('Ids')).forEach(control => {
        const name = control.slice(0, control.length - 3)
        const controlDrag = this.form?.get(name)
        if (controlDrag) {
          this.form?.get(control)?.setValue(controlDrag.value.map((base: Base) => base['id']))
        }
      })

      this.service.save(this.type, this.utilsService.updateValues(this.dto, this.form)).pipe(
        mergeMap(() => this.service.getAll(this.type))
      ).subscribe((dtos: Base[]) => {
        this.dataSource.next(dtos)
        ngForm.resetForm(this.dto)
      })
    }
  }

  openPosterDialog() {

  }

  reset(ngForm: FormGroupDirective) {
    ngForm.resetForm(this.dto)
    if (this.form) {
      Object.keys(this.form.controls).filter(control => control.endsWith('Ids')).forEach(control => {


        this.form?.get(control.slice(0, control.length - 3))?.setValue([])
        console.log(this.form?.get(control.slice(0, control.length - 3))?.value);
      })
    }


  }
}
