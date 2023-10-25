import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Category } from 'src/app/models/category.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
import { UtilsService } from 'src/app/service/utils/utils.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  series: Series[] = []
  categories: Category[] = []
  isOpened = false

  type: number[] = []

  formSearch = new FormGroup({
    term: new FormControl(''),
    ids: new FormControl(this.type),
    type: new FormControl('series')
  })

  constructor(private service: ApiSeriesService,
    private categoryService: ApiService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.service.getAll<Series>().subscribe((dtos: Series[]) => this.series = dtos)
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

    /* if (this.formSearch.controls.term.value && this.formSearch.controls.ids.value?.length != 0) {
      this.service.filteredSearch(this.utilsService.updateValues(new Series(),this.formSearch)).subscribe((dtos: Series[]) => this.series = dtos)
    }
    else if (this.formSearch.controls.term.value) {
      this.service.search<Series>('series', this.formSearch.controls.term.value).subscribe((dtos: Series[]) => this.series = dtos)
    }
    else if (this.formSearch.controls.ids.value?.length != 0) {
      this.service.getByCategoryIds(this.formSearch.controls.ids.value!).subscribe((dtos: Series[]) => this.series = dtos)
    }
    else {
      this.service.getAll<Series>('series').subscribe((dtos: Series[]) => this.series = dtos)
    } */
    if (this.formSearch.controls.term.value && this.formSearch.controls.ids.value?.length != 0) {
      console.log(this.formSearch.controls.type.value);

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

  private search<T>(type: string|((value: T) => void)){
    this.service.filteredSearch(this.utilsService.updateValues(new Series(),this.formSearch)).subscribe((dtos: Series[]) => this.series = dtos)
  }
}
