import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Series } from 'src/app/models/series.model';
import { CredentialService } from 'src/app/service/credential/credential.service';
import { ApiSeriesService } from 'src/app/service/series/api-series.service';
import { TokenService } from 'src/app/service/token/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  series: Series[] = []
  slicedsummary: boolean = true;

  constructor(private service: ApiSeriesService,
    private credentialService: CredentialService,
    private tokenService: TokenService) { }

  ngOnInit(): void {

    if (this.tokenService.isExist()) {
      combineLatest([
        this.credentialService.isExist(),
        this.service.getAll()
      ]).subscribe(([isExist, seriesDtos]) => {
        if (isExist)
          this.tokenService.logout()
        this.series = seriesDtos
      })
    }
    else {
      this.service.getAll().subscribe((dtos: Series[]) => {
        this.series = dtos
      })
    }


  }
}
