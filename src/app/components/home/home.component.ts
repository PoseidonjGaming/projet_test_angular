import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  series: Series[] = []
  slicedsummary: boolean = true;


  constructor(private service: ApiSeriesService,
    private credentialService: CredentialService,
    private tokenService: TokenService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    this.service.getAll<Series>('series').subscribe((dtos: Series[]) => {
      this.series = dtos
    })
    if (this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
      this.tokenService.deleteToken()
    }
  }
}
