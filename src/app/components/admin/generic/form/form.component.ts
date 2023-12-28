import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validator, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Base } from '../../../../models/base.model';
import { ApiService } from '../../../../service/api/api.service';
import { UtilsService } from '../../../../service/api/utils/utils.service';
import { SelectComponent } from './select/select.component';
import { filter } from 'rxjs';


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
    MatButtonModule,
    MatSnackBarModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

  @Input({ required: true }) type = ''
  @Input({ required: true }) form?: FormGroup
  @Input({ required: true }) controls: { name: string, type: string }[] = []
  @Input({ required: true }) typeMap = new Map<string, string>()
  @Input({ required: true }) displayMap = new Map<string, string>()
  @Input() validators: { controlName: string, validators: ValidatorFn[] }[] = []

  @Output() submitEvent = new EventEmitter<{ dto: Base, type: string }>()

  private resetDto = new Base()

  constructor(private utilsService: UtilsService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    if (this.form) {
      this.resetDto = this.form.value
      Object.keys(this.form.controls).filter(c => c.endsWith('Id')).forEach(controlIdName => {
          this.form?.addControl(controlIdName.slice(0, controlIdName.length - 2), new FormControl([]))
      })

      this.validators.forEach(validator => {
        let control = this.form?.get(validator.controlName)
        if (control) {
          control.addValidators(validator.validators)
        }
      })

    }



  }

  submit(ngForm: FormGroupDirective) {
    this.form?.markAllAsTouched()
    if (this.form && this.form.valid) {
      this.submitEvent.emit({ dto: this.utilsService.updateValues(this.resetDto, this.form), type: 'submit' })
      this.reset(ngForm)
    }
  }

  toAdd(ngForm: FormGroupDirective) {
    if (this.form) {
      this.submitEvent.emit({ dto: this.utilsService.updateValues(this.resetDto, this.form), type: 'toAdd' })
      this.reset(ngForm)
      this.snack.open('Elément ajouté à la liste', 'Fermer', { duration: 5 * 1000 })
    }
  }

  reset(ngForm: FormGroupDirective) {
    Object.keys(this.resetDto).filter(e => e.endsWith('Id')).forEach(e => {
      const controlName = e.slice(0, e.length - 2)
      const control = this.form?.controls[controlName]
      if (control) {
        this.resetDto[controlName] = control.value
      }
    })
    ngForm.resetForm(this.resetDto)
  }

  setPoster(event: Event) {

  }

  openPosterDialog() {

  }

}
