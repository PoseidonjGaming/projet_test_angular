import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Series } from '../../models/series.model';
import { ApiService } from '../../service/api.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  series: Series[] = []
  slicedsummary: boolean = true;


  constructor(private service: ApiService) { }

  ngOnInit(): void {
    this.service.getAll<Series>('series').subscribe((dtos: Series[]) => {
      this.series = dtos
    })
    // if (this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
    //   this.tokenService.deleteToken()
    // }
  }
}
