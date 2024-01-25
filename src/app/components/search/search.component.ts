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
import { MatchMode } from '../../models/enum/matchMode.model';
import { StringMatcher } from '../../models/enum/stringMatcher.model';
import { Series } from '../../models/series.model';
import { ApiService } from '../../service/api/api.service';
import { UtilsService } from '../../service/utils/utils.service';
import { MenuComponent } from '../menu/menu.component';
import { MatButtonModule } from '@angular/material/button';
import { Sorter } from '../../models/sorter.model';

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

  sortOptions: Sort[] = [
    { active: 'id', direction: Sorter.ASC, display: "Identifiant" },
    { active: 'id', direction: Sorter.DESC, display: "Identifiant" },
    { active: 'releaseDate', direction: Sorter.ASC, display: "Date de sortie" },
    { active: 'releaseDate', direction: Sorter.DESC, display: "Date de sortie" }
  ]


  formSearch = new FormGroup({
    name: new FormControl(''),
    categoryIds: new FormControl<number[]>([]),
    type: new FormControl<string>('series'),
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    sort: new FormControl(this.sortOptions[0])
  })

  constructor(private service: ApiService,
    private categoryService: ApiService) { }

  ngOnInit(): void {
    this.categoryService.getAll<Category>('category').subscribe((dtos: Category[]) => this.categories = dtos)
    this.submit()
  }

  submit() {
    const value = this.formSearch.value
    if (value.type && value.categoryIds) {
      this.service.sortSearch<Base>(value.type,
        value.sort?.active!, value.sort?.direction!, value,
        MatchMode.ALL, StringMatcher.CONTAINING,
        value.startDate!, value.endDate!
      ).subscribe((dtos: Base[]) => {
        this.results = dtos
      })
    }



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
  }

  getDirection(sorter: Sorter) {
    return (sorter === 'ASC') ? 'croissant' : 'décroissant'
  }
}

class Sort {
  active = 'id'
  direction: Sorter = Sorter.ASC
  display = ''
}