import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { mergeMap } from 'rxjs';
import { MatchMode } from '../../../models/enum/matchMode.model';
import { StringMatcher } from '../../../models/enum/stringMatcher.model';
import { Review } from '../../../models/review.model';
import { Series } from '../../../models/series.model';
import { User } from '../../../models/user.model';
import { ApiService } from '../../../service/api/api.service';
import { CredentialService } from '../../../service/api/credential/credential.service';
import { FileService } from '../../../service/api/file/file.service';
import { TokenService } from '../../../service/api/token/token.service';
import { UtilsService } from '../../../service/utils/utils.service';
import { Password } from '../../../validators/passwordValidator.validator';
import { DisplayFileDialogComponent } from '../../admin/generic/form/file/display-file-dialog/display-file-dialog.component';
import { MenuComponent } from '../../menu/menu.component';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';
import { ApiUserService } from '../../../service/api/user/api-user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MenuComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ScrollingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  file?: File

  reviews: Review[] = []

  private user: User = new User()

  formUser = new FormGroup({
    id: new FormControl(null),
    username: new FormControl(''),
    currentPassword: new FormControl(null),
    password: new FormControl(null),
    confirmPassword: new FormControl(null),
    avatarFile: new FormControl('')
  })

  constructor(private tokenService: TokenService,
    private service: ApiUserService,
    private credentialService: CredentialService,
    private fileService: FileService,
    private utils: UtilsService,
    private dialog: MatDialog) {
    this.formUser.controls.confirmPassword.addValidators([Password.checkNew(this.formUser.controls.password), Password.checkOld(this.formUser.controls.currentPassword)])
    this.formUser.controls.password.addValidators(Password.checkOld(this.formUser.controls.currentPassword))
  }


  ngOnInit(): void {
    this.getReview().subscribe((seriesDtos: Series[]) => {
      this.reviews.forEach((r: Review) => {
        r['name'] = seriesDtos.find(s => s.id == r.seriesId)?.name
        r['poster'] = seriesDtos.find(s => s.id == r.seriesId)?.poster
      })
    })
  }

  getReview() {
    return this.service.getByUsername().pipe(

      mergeMap((dtos: User) => {
        this.utils.populate(dtos, this.formUser)
        this.user = dtos

        return this.service.search<Review>('review', { userId: dtos.id },
          MatchMode.ALL, StringMatcher.EXACT, null, null)
      }),
      mergeMap((reviewDtos: Review[]) => {
        this.reviews = reviewDtos
        return this.service.getByIds<Series>('series', reviewDtos.map(r => r.seriesId))
      })
    )
  }

  submit() {
    if (this.formUser.valid) {
      const dto = this.utils.updateValues(new User(), this.formUser)
      dto['avatarFile'] = this.file?.name
      this.credentialService.updateAccount(dto as User).subscribe(() => { })
      this.fileService.upload(this.file!, 'user').subscribe(() => { })
    }
  }

  setAvatar(event: any) {
    this.file = event.target.files[0] as File
  }

  openPosterDialog() {
    this.dialog.open(DisplayFileDialogComponent, {
      data: this.file
    })
  }

  reset(form: FormGroupDirective) {
    form.resetForm(this.user)
  }

  updateReview(review: Review) {
    this.dialog.open(ReviewDialogComponent, {
      data: review,
      height: '45vh',
      width: '90vw'
    }).afterClosed().pipe(
      mergeMap(() => this.service.search<Review>('review',
        { userId: this.user.id },
        MatchMode.ALL, StringMatcher.EXACT, null, null)),
      mergeMap((reviewDtos: Review[]) => {
        this.reviews = reviewDtos
        return this.service.getByIds<Series>('series', reviewDtos.map(r => r.seriesId))
      })
    ).subscribe((seriesDtos: Series[]) => {
      this.reviews.forEach((r: Review) => {
        r['name'] = seriesDtos.find(s => s.id == r.seriesId)?.name
        r['poster'] = seriesDtos.find(s => s.id == r.seriesId)?.poster
      })
    })
  }

  deleteReview(reviewId: number) {
    this.service.delete<Review>('review', reviewId).pipe(
      mergeMap(() => this.getReview())
    ).subscribe((seriesDtos: Series[]) => {
      this.reviews.forEach((r: Review) => {
        r['name'] = seriesDtos.find(s => s.id == r.seriesId)?.name
        r['poster'] = seriesDtos.find(s => s.id == r.seriesId)?.poster
      })
    })
  }


}
