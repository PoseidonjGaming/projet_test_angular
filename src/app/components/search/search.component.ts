import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { Base } from '../../models/base.model';
import { Category } from '../../models/category.model';
import { MatchMode } from '../../models/enum/MatchMode.model';
import { StringMatcher } from '../../models/enum/StringMatcher.model';
import { Series } from '../../models/series.model';
import { ApiService } from '../../service/api/api.service';
import { UtilsService } from '../../service/api/utils/utils.service';
import { MenuComponent } from '../menu/menu.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MenuComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatSidenavModule,
    MatChipsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  results: Base[] = []
  categories: Category[] = []
  isOpened = false


  formSearch = new FormGroup({
    name: new FormControl(''),
    categoryIds: new FormControl<number[]>([]),
    type: new FormControl<string>('series'),
    startDate: new FormControl(null),
    endDate: new FormControl(null)
  })

  constructor(private service: ApiService,
    private categoryService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<Series>('series').subscribe((dtos: Series[]) => this.results = dtos)
    this.categoryService.getAll<Category>('category').subscribe((dtos: Category[]) => this.categories = dtos)
  }

  submit() {
    let dto = {}
    const value = this.formSearch.value
    if (value.type && value.categoryIds) {
      if (value.name && value.categoryIds.length > 0) {
        dto = { name: value.name, categoryIds: value.categoryIds }
      } else if (value.name) {
        dto = { name: value.name }
      } else if (value.categoryIds) {
        dto = { categoryIds: value.categoryIds }
      }

      this.service.search<Base>(value.type, dto,
        MatchMode.ALL, StringMatcher.CONTAINING,
        value.startDate!, value.endDate!
      ).subscribe((dtos: Base[]) => {
        this.results = dtos
      })
    }

  }

  private isDate(date: Date | null | undefined) {
    return (date) ? date : null
  }

  panel(drawer: MatSidenav) {
    drawer.toggle()
    this.isOpened = !this.isOpened
  }

  reset() {
    this.formSearch.reset({
      categoryIds: [],
      name: '',
      type: 'series'
    })
    //this.service.getAll<Series>('series').subscribe((dtos: Series[]) => this.series = dtos)
  }
}
