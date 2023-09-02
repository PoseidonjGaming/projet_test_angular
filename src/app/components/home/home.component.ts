import { Component, OnInit } from '@angular/core';
import { Series } from 'src/app/models/series.model';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  series: Series[] = []
  slicedsummary: boolean = true;

  constructor(private service: ApiSeriesService) { }

  ngOnInit(): void {
    this.service.getAll('series').subscribe((d: Series[]) => this.series = d)

  }
}
