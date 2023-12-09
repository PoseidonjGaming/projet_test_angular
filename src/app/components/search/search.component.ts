import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { MatchMode } from 'src/app/models/MatchMode.model';
import { PageResponse } from 'src/app/models/PageResponse.model';
import { StringMatcher } from 'src/app/models/StringMatcher.model';
import { Base } from 'src/app/models/base.model';
import { Category } from 'src/app/models/category.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';
import { ApiSearchService } from 'src/app/service/search/api-search.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
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

  constructor(private service: ApiSearchService,
    private categoryService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<PageResponse<Series>>(0, 0, 'series').subscribe((dtos: PageResponse<Series>) => this.results = dtos.content)
    this.categoryService.getAll<PageResponse<Category>>(0, 0, 'category').subscribe((dtos: PageResponse<Category>) => this.categories = dtos.content)
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

      this.service.search<Base>(value.type,
        MatchMode.ALL, StringMatcher.CONTAINING,
        this.isDate(value.startDate), this.isDate(value.endDate),
        dto).subscribe((dtos: Base[]) => {
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
