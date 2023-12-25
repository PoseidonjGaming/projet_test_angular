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
        MatButtonModule
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {

    @Input({ required: true }) form?: FormGroup;
    @Input({ required: true }) controls: { name: string; type: string; }[] = [];
    @Input({ required: true }) typeMap = new Map<string, string>();
    @Input({ required: true }) displayMap = new Map<string, string>();
    @Input({ required: true }) type = '';
    @Input() dataSource = new Subject<Base[]>();

    private resetDto: Base = new Base();

    constructor(private service: ApiService) { }

    setPoster(event: Event) {
    }

    submit(ngForm: FormGroupDirective) {
        if (this.form?.valid) {
            this.service.save(this.type, this.form.value).pipe(
                mergeMap(() => this.service.getAll(this.type))
            ).subscribe((dtos: Base[]) => {
                this.dataSource.next(dtos);
                ngForm.resetForm(new Base());
            });
        }
    }

    openPosterDialog() {
    }

    reset(ngForm: FormGroupDirective) {
        ngForm.resetForm(new Base());
    }
}
