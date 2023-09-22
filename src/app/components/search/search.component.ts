import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Category } from 'src/app/models/category.model';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  series: Series[] = []
  categories: Category[] = []
  isOpened = false

  formSearch = new FormGroup({
    term: new FormControl(null),
    ids: new FormControl([])
  })

  constructor(private service: ApiSeriesService, private categoryService: ApiService<Category>) { }

  ngOnInit(): void {
    this.service.getAll('series').subscribe((dtos: Series[]) => this.series = dtos)
    this.categoryService.getAll('category').subscribe((dtos: Category[]) => this.categories = dtos)
  }

  submit() {
    console.log(this.formSearch.value);

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
      this.service.filteredSearch(this.formSearch.value).subscribe((dtos: Series[]) => this.series = dtos)
    }
    else if (this.formSearch.controls.term.value) {
      this.service.search('series', this.formSearch.controls.term.value).subscribe((dtos: Series[]) => this.series = dtos)
    }
    else if (this.formSearch.controls.ids.value?.length != 0) {
      this.service.getByCategoryIds(this.formSearch.controls.ids.value).subscribe((dtos: Series[]) => this.series = dtos)
    }
    else {
      this.service.getAll('series').subscribe((dtos: Series[]) => this.series = dtos)
    }
  }

  panel(drawer: MatDrawer) {
    drawer.toggle()
    this.isOpened = !this.isOpened
  }

  reset() {
    this.formSearch.reset()
    this.service.getAll('series').subscribe((dtos: Series[]) => this.series = dtos)
  }
}
