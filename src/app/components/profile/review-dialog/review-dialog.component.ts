import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { Series } from '../../../models/series.model';
import { ApiService } from '../../../service/api/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../../models/review.model';
import { UtilsService } from '../../../service/utils/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { mergeMap } from 'rxjs';
import { MatchMode } from '../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../models/enum/StringMatcher.model';
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
    MatSelectModule,
    MatButtonModule
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

  constructor(private service: ApiService,
    private utilService: UtilsService,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Review) { }

  ngOnInit(): void {
    this.utilService.populate<Review>(this.data, this.formReview)
    this.service.getAll<Series>('series').subscribe((seriesDTOS: Series[]) => {
      this.series = seriesDTOS
    })
  }

  submit() {
    this.service.save('review', this.utilService.updateValues<Review>(new Review(), this.formReview)).subscribe(() => {
      this.dialogRef.close()
    })


  }

}
