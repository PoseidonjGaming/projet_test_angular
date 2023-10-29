import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
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
    term: new FormControl(''),
    ids: new FormControl(this.type),
    type: new FormControl('series')
  })

  constructor(private service: ApiSearchService,
    private categoryService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<Series>('series').subscribe((dtos: Series[]) => this.results = dtos)
    this.categoryService.getAll<Category>('category').subscribe((dtos: Category[]) => this.categories = dtos)
  }

  submit() {

    // if (!this.formSearch.controls.term.value) {
    //   this.service.getByCategoryIds(this.formSearch.controls.ids.value).subscribe((dtos: Series[]) => this.series = dtos)
    // }
    // else if (this.formSearch.controls.ids.value?.length == 0) {
    //   this.service.search('series', this.formSearch.controls.term.value).subscribe((dtos: Series[]) => this.series = dtos)
    // }
    // else {
    //   this.service.filteredSearch(this.formSearch.value).subscribe((dtos: Series[]) => this.series = dtos)
    // }

    if (this.formSearch.controls.term.value && this.formSearch.controls.ids.value?.length != 0) {
      this.service.filteredSearch<Base>(this.utilsService.updateValues(new Base(), this.formSearch), this.formSearch.controls.type.value!).subscribe((dtos: Base[]) => this.results = dtos)
    }
    else if (this.formSearch.controls.term.value) {
      this.service.search<Base>(this.formSearch.controls.type.value!, this.formSearch.controls.term.value).subscribe((dtos: Base[]) => this.results = dtos)
    }
    else if (this.formSearch.controls.ids.value?.length != 0) {
      this.service.getByCategoryIds<Base>(this.formSearch.controls.ids.value!, this.formSearch.controls.type.value!).subscribe((dtos: Base[]) => this.results = dtos)
    }
    else {
      this.service.getAll<Base>(this.formSearch.controls.type.value!).subscribe((dtos: Base[]) => this.results = dtos)
    }
  }

  panel(drawer: MatDrawer) {
    drawer.toggle()
    this.isOpened = !this.isOpened
  }

  reset() {
    this.formSearch.reset({
      ids: [],
      term: null,
      type: 'series'
    })
    //this.service.getAll<Series>('series').subscribe((dtos: Series[]) => this.series = dtos)
  }
}
