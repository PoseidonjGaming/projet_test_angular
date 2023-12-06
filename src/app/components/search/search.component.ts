import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
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

  type: number[] = []

  formSearch = new FormGroup({
    name: new FormControl(''),
    categoryIds: new FormControl(this.type),
    type: new FormControl('series'),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date())
  })

  constructor(private service: ApiSearchService,
    private categoryService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<PageResponse<Series>>(0, 0, 'series').subscribe((dtos: PageResponse<Series>) => this.results = dtos.content)
    this.categoryService.getAll<PageResponse<Category>>(0, 0, 'category').subscribe((dtos: PageResponse<Category>) => this.categories = dtos.content)
  }

  submit() {
    if (this.formSearch.controls.name.value) {
      this.service.search<Base>(this.formSearch.controls.type.value!,
        MatchMode.ALL, StringMatcher.CONTAINING, this.formSearch.value).subscribe((dtos: Base[]) => {
          this.results = dtos
        })
    } else {
      this.service.getAll<PageResponse<Base>>(0, 0, this.formSearch.controls.type.value!).subscribe((dtos: PageResponse<Base>) => {
        this.results = dtos.content
      })
    }


  }

  panel(drawer: MatDrawer) {
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
