import { Component, OnInit, Type } from '@angular/core';
import { Series } from 'src/app/models/series.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  series: Series[] = []
  slicedResume: boolean = true;

  constructor(private service: ApiService<Series>) { }

  ngOnInit(): void {
    this.service.getAll('series').subscribe((d: Series[]) => this.series = d)

  }
}
