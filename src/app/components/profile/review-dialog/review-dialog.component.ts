import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { Series } from '../../../models/series.model';
import { ApiService } from '../../../service/api/api.service';
;

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.css'
})
export class ReviewDialogComponent implements OnInit {

  formReview = new FormGroup({
    id: new FormControl(0),
    note: new FormControl(0, [Validators.min(0), Validators.max(5)]),
    comment: new FormControl('', [Validators.maxLength(255)]),
    seriesId: new FormControl(0, Validators.required),
    userId: new FormControl(0, Validators.required)
  })

  series: Series[] = []

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.service.getAll<Series>('series').subscribe((seriesDTOS: Series[]) => {
      this.series = seriesDTOS
    })
  }

}
