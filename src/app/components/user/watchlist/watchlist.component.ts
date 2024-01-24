import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { TokenService } from '../../../service/api/token/token.service';
import { ApiService } from '../../../service/api/api.service';
import { User } from '../../../models/user.model';
import { MatchMode } from '../../../models/enum/MatchMode.model';
import { StringMatcher } from '../../../models/enum/StringMatcher.model';
import { mergeMap } from 'rxjs';
import { Series } from '../../../models/series.model';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ApiUserService } from '../../../service/api/user/api-user.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {

  series: Series[] = []

  constructor(private service: ApiUserService, private tokenService: TokenService) { }


  ngOnInit(): void {
    this.service.getByUsername().pipe(
        mergeMap((userDTOS: User) => this.service.getByIds<Series>('series', userDTOS.seriesIds))
      ).subscribe((seriesDTOS: Series[]) => {
        this.series = seriesDTOS
      })
  }

}
