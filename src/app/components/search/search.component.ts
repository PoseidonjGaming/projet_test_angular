import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Base } from '../../models/base.model';
import { Sorter } from '../../models/sorter.model';
import { ApiService } from '../../service/api/api.service';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MenuComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  results: Base[] = []

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.service.getAll('series').subscribe(value => {
      this.results = value
    })
  }

  submit() {
  }

  reset() {

  }

  getId() {

  }
}

class Sort {
  active = 'id'
  direction: Sorter = Sorter.ASC
  display = ''
}