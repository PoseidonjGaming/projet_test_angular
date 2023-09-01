import { Component, OnInit } from '@angular/core';
import { Series } from 'src/app/models/series.model';
import { SeriesService } from 'src/app/service/series/series.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  series: Series[] = []
  slicedResume: boolean = true;

  constructor(private service: SeriesService) { }

  ngOnInit(): void {
    this.service.getAll('series').subscribe((d: Series[]) => this.series = d)

  }
}
